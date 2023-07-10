import { Configuration, OpenAIApi } from "openai";

class aiChatManager {
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
        model: "davinci-codex",
        prompt,
        max_tokens: 50,
        temperature: 0.7,
        n: 1,
      });

      const response = completion.data.choices[0].text.trim();
      return response;
    } catch (error) {
      console.error("Error generating AI response:", error);
      throw error;
    }
  }
}

export { aiChatManager };
