import mapLimit from 'async/mapLimit';
import superagent from 'superagent';
import mongoConnect from './utils/mongoConnect';
import {config} from './config';

var amqp = require('amqplib');

amqp.connect('amqp://192.168.99.100').then((conn) => {
    return conn.createChannel().then(async(ch) => {
        let ok = await ch.assertQueue('duanziList', {durable: true});
        ch.prefetch(1);
        ch.consume('duanziList', doWork.bind(ch), {noAck: false});
        console.log(" [*] Waiting for messages. To exit press CTRL+C");
    });
}).catch(console.warn);


function doWork(msg) {
    let duanziList = JSON.parse(msg.content.toString());
    console.log(" [x] One List Received");

    // async crawl
    var self = this;
    mapLimit(duanziList, config.concurrent,
    (id, callback)=>{
        console.log("current duanziId is " + id);
        superagent.get("http://jandan.net/tucao/" + id)
        .end((err, response) => {
            if (err) {
                console.log("get tucao failed, id = " + id);
                console.log(err);
                let delay = Math.random()*config.interval;
                setTimeout(function(){
                    callback(null, {
                        failed: true,
                        duanziId: id
                    });
                },delay);

            }else {
                let res = JSON.parse(response.text);
                // create a random delay and call callback function
                let delay = Math.random()*config.interval;
                setTimeout(function(){
                    callback(null, {
                        tucao: res['tucao'],
                        duanziId: id
                    });
                },delay);
            }
        })
    },
    (err, result)=>{
        if (err) {
            console.log("error happened");
            console.log(err);
        }else {
            console.log("mapLimit done");
            console.log(" [x] One Task Done");
            // filter to find whether err happened
            if (result.filter((item)=>{if (item.failed == true) return true;}).length > 0) {
                console.log("error happened when request tucao");
                self.nack(msg);
            }else {
                self.ack(msg); // this is ch, call ack to notify
                saveToMongoDB(result);
            }

        }
    })
}

function saveToMongoDB(result){
    mongoConnect(config.mongodbAddr)
    .then(
        async (db)=>{
            try {
                const collection = db.collection(config.tucaoCollectionName);
                const res = await collection.insertMany(result);
                console.log("save tucao success");
            }
            catch(err) {
                console.log("save error");
                db.close();
                throw err;
            }
            db.close();
        },
        (err)=>{
            console.log("db connection error")
            throw err;
        }
    )
    .catch((err)=>{
        console.log(err);
    })
}
