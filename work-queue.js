const amqp = require('amqplib');

async function produce() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queueName = 'task_queue';

    channel.assertQueue(queueName, { durable: true });

    setInterval(() => {
        const task = 'Task to be processed';
        channel.sendToQueue(queueName, Buffer.from(task), { persistent: true });
        console.log('Sent task:', task);
    }, 1000);
}

produce().catch(console.error);


async function consume() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queueName = 'task_queue';

    channel.assertQueue(queueName, { durable: true });
    channel.prefetch(1); // Process one message at a time

    console.log("Waiting for tasks...");

    channel.consume(queueName, async (msg) => {
        const task = msg.content.toString();
        console.log("Received task:", task);

        // Simulate task processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log("Task processed:", task);
        channel.ack(msg); // Acknowledge task completion
    });
}

consume().catch(console.error);
