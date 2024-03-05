const amqp = require('amqplib');

async function setup() {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Declare an exchange
    const exchangeName = 'logs';
    await channel.assertExchange(exchangeName, 'fanout', { durable: false });

    // Declare a queue with a random name
    const queue = await channel.assertQueue('', { exclusive: true });

    // Bind the queue to the exchange
    await channel.bindQueue(queue.queue, exchangeName, '');

    console.log(" [*] Waiting for messages. To exit press CTRL+C");

    // Receive messages from the queue
    channel.consume(queue.queue, (message) => {
      console.log(" [x] Received %s", message.content.toString());
    }, { noAck: true });
  } catch (error) {
    console.error(error);
  }
}

async function send() {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Declare an exchange
    const exchangeName = 'logs';
    await channel.assertExchange(exchangeName, 'fanout', { durable: false });

    // Send a message to the exchange
    const message = process.argv.slice(2).join(' ') || 'Hello World!';
    channel.publish(exchangeName, '', Buffer.from(message));

    console.log(" [x] Sent %s", message);

    // Close the connection
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
}

// Receive messages (subscribe)
setup();

// Send a message (publish)
send();
