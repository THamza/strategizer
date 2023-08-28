import amqp from "amqplib";

export async function connectRabbitMQ(): Promise<amqp.Channel> {
  const connection = await amqp.connect(process.env.CLOUDAMQP_URL!); // using a non-null assertion for env variable
  const channel = await connection.createChannel();
  return channel;
}
