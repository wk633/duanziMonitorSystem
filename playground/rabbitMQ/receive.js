var amqp = require('amqplib');
amqp.connect('amqp://192.168.99.100').then(
    async (conn) => {
        try {
            let ch = await conn.createChannel();
            let q = 'hello';
            let ok = await ch.assertQueue(q, {durable: false});
            console.log(ok);
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
            let mm = await ch.consume(q, (msg)=>{
                console.log(" [x] Received %s", msg.content.toString());
            } ,{noAck: true});
            console.log(mm);
            conn.close();
        }catch(err){
            console.log(err);
            conn.close();
        }
})
.catch(console.warn);
