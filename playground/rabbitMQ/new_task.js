var amqp = require('amqplib');

amqp.connect('amqp://192.168.99.100').then(async (conn) => {
  return conn.createChannel().then(async(ch) => {
    var q = 'task_queue';
    let ok = await ch.assertQueue(q, {durable: true});
    let msg = process.argv.slice(2).join(' ') || "Hello World!";
    console.log(" [x] Sent '%s'", msg);
    ch.sendToQueue(q, new Buffer(msg), {deliveryMode: true});
    return ch.close();
  }).finally(function() { conn.close(); });
}).catch(console.warn);
