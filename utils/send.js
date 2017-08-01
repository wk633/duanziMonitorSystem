export function sendToQueue(queueName, msg){
    if (typeof msg !== 'string') {
        msg = JSON.stringify(msg);
    }
    var amqp = require('amqplib');
    amqp.connect('amqp://192.168.99.100').then(async (conn) => {
      return conn.createConfirmChannel().then(async(ch) => {

        let ok = await ch.assertQueue(queueName, {durable: true});
        ch.sendToQueue(queueName, new Buffer(msg), {deliveryMode: true}, (err, ok)=>{
            if (err !== null)
                console.log(" [x] Sent '%s' failed!!", msg);
            else
                console.log(" [x] Sent '%s'", msg);
        });
        await ch.waitForConfirms();
        return ch.close();
      }).finally(function() { conn.close(); });
    }).catch(console.warn);
}
