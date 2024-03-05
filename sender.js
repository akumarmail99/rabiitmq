const amqp = require('amqplib');

async function send() {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Declare a queue
    const queueName = 'pointToPointQueue';
    await channel.assertQueue(queueName, { durable: false });

    // Send a message to the queue
    const message = 'Hello, RabbitMQ!';
    channel.sendToQueue(queueName, Buffer.from(message));

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

async function receive() {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Declare a queue
    const queueName = 'pointToPointQueue';
    await channel.assertQueue(queueName, { durable: false });

    // Receive messages from the queue
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
    channel.consume(queueName, (message) => {
      console.log(" [x] Received %s", message.content.toString());
    }, { noAck: true });
  } catch (error) {
    console.error(error);
  }
}

// Send a message
send();

// Receive messages
receive();
