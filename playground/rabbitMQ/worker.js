var amqp = require('amqplib');

amqp.connect('amqp://192.168.99.100').then((conn) => {
    return conn.createChannel().then(async(ch) => {
        let ok = await ch.assertQueue('task_queue', {durable: true});
        ch.prefetch(1);
        ch.consume('task_queue', doWork.bind(ch), {noAck: false});
        console.log(" [*] Waiting for messages. To exit press CTRL+C");
    });
}).catch(console.warn);

function doWork(msg) {
    var body = msg.content.toString();
    console.log(" [x] Received '%s'", body);
    var secs = body.split('.').length - 1;
    console.log(" [x] Task takes %d seconds", secs);

    const doneAck = () => {
        console.log(" [x] Done");
        this.ack(msg); // this is ch
    }
    setTimeout(doneAck, secs * 1000);
}
