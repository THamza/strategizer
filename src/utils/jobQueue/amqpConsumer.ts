import { AiChatManager } from "../../server/aiChatManager/aiChatManager";
import { PrismaClient } from "@prisma/client";
import { connectRabbitMQ } from "./amqpConnection";
import { ConsumeMessage } from "amqplib";
import { ContentGenerationTask } from "./types"; // Import it here
import { promptGraphMetadataSchema } from "../../utils/tsStyles";
import { getFormatedProject } from "../../utils/helpers";
import { promptManager } from "../../server/promptManager/promptManager";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

async function startConsumer() {
  const channel = await connectRabbitMQ();
  const queueName = "POST_GENERATION_QUEUE";

  await channel.assertQueue(queueName, { durable: true });

  channel.consume(queueName, async (msg: ConsumeMessage | null) => {
    try {
      if (msg !== null) {
        const task: ContentGenerationTask = JSON.parse(msg.content.toString());

        const project = await prisma.project.findUnique({
          where: { id: task.projectId },
        });

        if (!project || project.userId !== task.userId) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No such project found for the current user.",
          });
        }

        switch (task.contentType) {
          case "Post":
            const prompt = promptManager.getPrompt(
              "post",
              getFormatedProject(project),
              promptGraphMetadataSchema.parse(task.metadata)
            );

            if (!prompt) {
              return {
                success: false,
                post: null,
              };
            }

            const response = await new AiChatManager().getResponse(prompt);

            const post = await prisma.post.create({
              data: {
                content: response,
                projectId: task.projectId,
              },
            });

            channel.ack(msg);

            return {
              success: true,
              post,
            };
            break;
        }
      }
    } catch (error) {
      console.error("Failed to process message:", error);
      channel.nack(msg); // or channel.reject(msg, false) to not requeue the message
    }
  });
}

startConsumer();
