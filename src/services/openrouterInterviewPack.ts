import OpenAI, { APIError } from "openai";
import { INTERVIEW_PACK_SYSTEM_PROMPT } from "../constants/interviewPack";

export type InterviewPack = Record<string, unknown> & {
  query?: string;
  executive_summary?: string;
  quick_facts?: string[];
  company_summary?: Record<string, unknown>;
  product_area?: Record<string, unknown>;
  interview_plan?: Record<string, unknown>;
  pre_work?: Record<string, unknown>;
  sources?: {
    title: string;
    publisher?: string;
    url: string;
    date?: string;
  }[];
};

const DEFAULT_MODEL = "google/gemini-2.5-flash-preview-09-2025"; // aligned with Prospect Vetting Assistant
const GOOGLE_SEARCH_TOOL = { type: "google_search" } as unknown as any;
type CompletionParams = Parameters<OpenAI["chat"]["completions"]["create"]>[0];

class OpenRouterInterviewPackService {
  private client: OpenAI | null = null;

  initialize(apiKey?: string) {
    if (!apiKey) return;
    this.client = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "",
        "X-Title": "Louis Sergiacomi Portfolio",
      },
      dangerouslyAllowBrowser: true,
    });
  }

  private ensureInitialized() {
    if (!this.client) throw new Error("OpenRouter client not initialized. Please provide an API key.");
  }

  async generateInterviewPack(userQuery: string): Promise<InterviewPack> {
    this.ensureInitialized();

    const baseParams: CompletionParams = {
      model: DEFAULT_MODEL,
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages: [
        { role: "system", content: INTERVIEW_PACK_SYSTEM_PROMPT },
        { role: "user", content: userQuery.trim() },
      ],
    };

    const withSearchTool: CompletionParams = {
      ...baseParams,
      tools: [GOOGLE_SEARCH_TOOL],
      tool_choice: "auto",
    };

    let response;

    try {
      response = await this.client!.chat.completions.create(withSearchTool);
    } catch (error) {
      if (isProviderError(error)) {
        console.warn(
          "[Interview Pack] Google Search tool unavailable, retrying without tool.",
          error
        );
        response = await this.client!.chat.completions.create(baseParams);
      } else {
        throw error;
      }
    }

    const completion = response as OpenAI.Chat.Completions.ChatCompletion;
    const content = completion.choices?.[0]?.message?.content || "{}";
    try {
      const parsed = JSON.parse(content);
      return parsed as InterviewPack;
    } catch (err) {
      throw new Error("The model did not return valid JSON. Please refine the query and try again.");
    }
  }
}

export const openRouterInterviewPackService = new OpenRouterInterviewPackService();

function isProviderError(error: unknown): error is APIError {
  return error instanceof APIError && error.type === "provider_error";
}
