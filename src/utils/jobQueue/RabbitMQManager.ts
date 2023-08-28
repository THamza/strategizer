import { connectRabbitMQ } from "./amqpConnection";

const queueName = "POST_GENERATION_QUEUE";
let rabbitMQChannel;

export class RabbitMQManager {
  static async initialize() {
    if (!rabbitMQChannel) {
      rabbitMQChannel = await connectRabbitMQ();
      rabbitMQChannel.assertQueue(queueName);
    }
  }

  static getChannel() {
    if (!rabbitMQChannel) {
      throw new Error("RabbitMQ channel is not initialized");
    }
    return rabbitMQChannel;
  }
}
