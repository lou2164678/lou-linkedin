import OpenAI, { APIError } from "openai";
import type { ChatCompletionTool } from "openai/resources/chat/completions";

const DEFAULT_MODEL = "google/gemini-2.5-flash-preview-09-2025";
const GOOGLE_SEARCH_TOOL = { type: "google_search" } as unknown as ChatCompletionTool;
type CompletionParams = Parameters<OpenAI["chat"]["completions"]["create"]>[0];

const PROSPECT_PROMPT = (companyName: string) => `You are a senior revenue strategist preparing a prospecting brief.

Write a concise yet comprehensive Markdown report for **${companyName}** that a quota-carrying seller can skim in under two minutes.

Formatting contract:
- Start with \`# Prospect Research: ${companyName}\`.
- Each major section must start with \`##\` followed by an emoji and title exactly in this order:
  1. \`## 🏢 Company Snapshot\`
  2. \`## 🧭 Strategic Position\`
  3. \`## 🛠️ Products & Solutions\`
  4. \`## 🤝 Key Buyers & Contacts\`
  5. \`## 😖 Pain Points & Triggers\`
  6. \`## ✅ Recommended Plays\`
  7. \`## ⚠️ Risks & Objections\`
  8. \`## 📚 Sources\`
- Use short paragraphs for narrative sections. Avoid repeated \`**\` emphasis except for short labels (e.g., "**Metric:** 25% YoY growth").
- For \`Company Snapshot\`, provide 6–8 key facts as bullet items using the format \`**Label:** Value\`.
- For \`Key Buyers & Contacts\`, produce a Markdown table with columns \`Name | Role | Focus Area | Recommended Angle\`. If a specific name is unknown, use the most likely title.
- For \`Products & Solutions\`, produce a Markdown table with columns \`Offering | Ideal Persona | Differentiator | Proof\`.
- For \`Pain Points & Triggers\`, produce a Markdown table with columns \`Pain Point | Trigger | Implication | Sales Angle\`.
- For \`Recommended Plays\`, produce a Markdown table with columns \`Play | Target Persona | Proof Point | CTA\`.
- For \`Risks & Objections\`, produce a Markdown table with columns \`Risk / Objection | Likely Concern | Mitigation | Asset / Evidence\`.
- For \`Strategic Position\`, use bullet items in the format \`**Theme:** supporting insight\`.
- In the Sources section, provide numbered entries like \`[1] Title — Publisher (YYYY-MM-DD) <https://...>\`.

Research rules:
- Use live web results (Google Search tool) to ground every claim. Prefer sources from the last 12 months; if older, note the year.
- Surface metrics, buying triggers, product launches, executive moves, and initiatives relevant to sales cycles.
- Highlight uncertainties or information gaps explicitly so the rep knows what to validate.
- Never fabricate data. Mark unknown values as "Unknown" and explain the gap.

Return only Markdown that adheres to the contract. Do not wrap the response in JSON.`;

type StreamContentPart =
  | string
  | {
    type?: string;
    text?: string;
    output_text?: string | string[];
    [key: string]: unknown;
  };

interface StreamChunk {
  choices?: {
    delta?: {
      content?: StreamContentPart | StreamContentPart[];
      output_text?: string | string[];
      [key: string]: unknown;
    };
    message?: {
      content?: StreamContentPart | StreamContentPart[];
    };
  }[];
}

class OpenRouterGeminiService {
  private client: OpenAI | null = null;

  initialize(apiKey?: string) {
    if (!apiKey) {
      return;
    }

    this.client = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer":
          typeof window !== "undefined" ? window.location.origin : "",
        "X-Title": "Louis Sergiacomi Portfolio",
      },
      dangerouslyAllowBrowser: true,
    });
  }

  private ensureInitialized() {
    if (!this.client) {
      throw new Error(
        "OpenRouter client not initialized. Please provide an API key."
      );
    }
  }

  async *generateProspectReportStream(
    companyName: string,
    signal?: AbortSignal
  ): AsyncGenerator<
    string,
    void,
    void
  > {
    this.ensureInitialized();

    const systemMessage =
      "You are an elite B2B sales researcher who writes actionable, well sourced briefings.";

    const baseParams = {
      model: DEFAULT_MODEL,
      stream: true,
      temperature: 0.2,
      messages: [
        { role: "system", content: systemMessage },
        {
          role: "user",
          content: PROSPECT_PROMPT(companyName),
        },
      ] as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    };

    const withSearchTool = {
      ...baseParams,
      tools: [GOOGLE_SEARCH_TOOL],
      tool_choice: "auto" as const,
    };

    const createCompletion = (params: CompletionParams) =>
      this.client!.chat.completions.create(
        params,
        signal ? { signal } : undefined
      );

    let completion: AsyncIterable<StreamChunk>;

    try {
      completion = (await createCompletion(
        withSearchTool
      )) as AsyncIterable<StreamChunk>;
    } catch (error) {
      if (isProviderError(error)) {
        console.warn(
          "[Prospect Vetting] Google Search tool unavailable, retrying without tool.",
          error
        );
        completion = (await createCompletion(
          baseParams
        )) as AsyncIterable<StreamChunk>;
      } else {
        throw error;
      }
    }

    for await (const chunk of completion) {
      const choice = chunk.choices?.[0];
      if (!choice) continue;

      const delta = choice.delta;
      if (delta?.content || delta?.output_text) {
        for (const part of normalizeParts(delta.content)) {
          yield part;
        }
        for (const part of normalizeParts(delta.output_text)) {
          yield part;
        }
        continue;
      }

      const messageContent = choice.message?.content;
      if (messageContent) {
        for (const part of normalizeParts(messageContent)) {
          yield part;
        }
      }
    }
  }
}

function normalizeParts(
  content: StreamContentPart | StreamContentPart[] | undefined
): string[] {
  if (!content) return [];
  const parts = Array.isArray(content) ? content : [content];
  const textParts: string[] = [];

  parts.forEach((part) => {
    if (typeof part === "string") {
      textParts.push(part);
      return;
    }

    if (typeof part.text === "string") {
      textParts.push(part.text);
      return;
    }

    if (typeof part.output_text === "string") {
      textParts.push(part.output_text);
      return;
    }

    if (Array.isArray(part.output_text)) {
      part.output_text.forEach((entry) => {
        if (typeof entry === "string") {
          textParts.push(entry);
        }
      });
    }
  });

  return textParts;
}

export const openRouterGeminiService = new OpenRouterGeminiService();

function isProviderError(error: unknown): error is APIError {
  return error instanceof APIError && error.type === "provider_error";
}
