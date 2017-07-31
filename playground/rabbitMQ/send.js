var amqp = require('amqplib');
amqp.connect('amqp://192.168.99.100').then(
    (conn) => {
        return conn
        .createChannel()
        .then(
            async(ch) => {
                var q = 'hello';
                var msg = 'Hello World!';
                let ok = await ch.assertQueue(q, {durable: false});
                console.log(ok);
                ch.sendToQueue(q, new Buffer(msg));
                console.log(" [x] Sent '%s'", msg);
                return ch.close();
            }
        ).finally(function() { conn.close(); });
    },
    (err) => {
        console.log("connection error")
    }
).catch(console.warn);
