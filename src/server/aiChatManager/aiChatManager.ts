import { Configuration, OpenAIApi } from "openai";
import { TRPCError } from "@trpc/server";

class AiChatManager {
  configuration: Configuration;
  openai: OpenAIApi;

  constructor() {
    this.configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(this.configuration);
  }

  async getResponse(prompt: string): Promise<string> {
    try {
      const completion = await this.openai
        .createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 1,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        })
        .then((data) => {
          let response = data?.data?.choices?.[0]?.message?.content || "";

          if (typeof response === "string") {
            return response;
          } else {
            throw new TRPCError({ code: "BAD_REQUEST" });
          }
        });
      return completion;
    } catch (error) {
      console.error("Error generating AI response:", error);
      throw error;
    }
  }
}

export { AiChatManager };
