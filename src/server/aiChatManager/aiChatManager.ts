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
      const completion = await this.openai.createCompletion({
        model: "gpt-3.5-turbo",
        prompt,
        max_tokens: 50,
        temperature: 0.7,
        n: 1,
      });

      const response =
        (completion.data.choices && completion.data.choices[0]?.text?.trim()) ||
        "";

      if (typeof response === "string") {
        return response;
      } else {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
      throw error;
    }
  }
}

export { AiChatManager };
