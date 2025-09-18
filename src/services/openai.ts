// Using OpenRouter API with sonoma-sky-alpha model as requested by user
import OpenAI from 'openai';

class OpenAIService {
  private client: OpenAI | null = null;
  
  initialize(apiKey?: string) {
    if (apiKey) {
      this.client = new OpenAI({ 
        apiKey,
        baseURL: "https://openrouter.ai/api/v1",
        dangerouslyAllowBrowser: true 
      });
    }
  }
  

  private ensureInitialized() {
    if (!this.client) {
      throw new Error('OpenAI client not initialized. Please provide an API key.');
    }
  }

  async generateCompanyBrief(companyName: string) {
    this.ensureInitialized();
    
    const prompt = `Generate a comprehensive company brief for "${companyName}". Respond with JSON in this exact format:
    {
      "company": {
        "name": "${companyName}",
        "website": "https://...",
        "industry": "...",
        "size": "...",
        "headquarters": "..."
      },
      "keyPeople": [
        {
          "name": "...",
          "title": "...",
          "background": "..."
        }
      ],
      "businessModel": {
        "description": "...",
        "revenue": "...",
        "keyProducts": ["..."]
      },
      "painPoints": ["..."],
      "talkingPoints": ["..."],
      "competitiveLandscape": ["..."],
      "recentNews": ["..."]
    }`;

    const response = await this.client!.chat.completions.create({
      model: "openrouter/sonoma-sky-alpha",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  async answerObjection(question: string, documents: string[] = []) {
    this.ensureInitialized();
    
    const context = documents.length > 0 
      ? `Context from knowledge base:\n${documents.join('\n\n')}\n\n`
      : '';
    
    const prompt = `${context}Answer this sales objection: "${question}"
    
    Respond with JSON in this exact format:
    {
      "answer": {
        "bullets": ["key point 1", "key point 2", "key point 3"],
        "caveat": "optional caveat or clarification",
        "talkTrack": "conversational response script"
      },
      "citations": [
        {
          "title": "document name",
          "page": 1
        }
      ],
      "context": [
        {
          "title": "document name", 
          "page": 1,
          "excerpt": "relevant excerpt"
        }
      ]
    }`;

    const response = await this.client!.chat.completions.create({
      model: "openrouter/sonoma-sky-alpha",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  async scoreAccounts(accounts: any[]) {
    this.ensureInitialized();
    
    const prompt = `Score these B2B accounts for sales priority (0-100). Respond with JSON in this exact format:
    {
      "accounts": [
        {
          "name": "...",
          "score": 85,
          "reasoning": "explanation of score",
          "firstPlay": "recommended first action",
          "industry": "...",
          "employees": 1000,
          "region": "..."
        }
      ],
      "summary": {
        "total": ${accounts.length},
        "highPriority": 0,
        "averageScore": 0
      }
    }
    
    Accounts to score: ${JSON.stringify(accounts)}`;

    const response = await this.client!.chat.completions.create({
      model: "openrouter/sonoma-sky-alpha", 
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  async generateBattlecard(ourSummary: string, competitors: any[], personas: string[]) {
    this.ensureInitialized();
    
    const prompt = `Generate a competitive battlecard. Respond with JSON in this exact format:
    {
      "competitivePositioning": {
        "ourStrengths": ["strength 1", "strength 2"],
        "competitorWeaknesses": ["weakness 1", "weakness 2"], 
        "differentiators": ["differentiator 1", "differentiator 2"]
      },
      "objectionHandling": [
        {
          "objection": "common objection",
          "response": "how to respond",
          "evidence": "supporting evidence"
        }
      ],
      "talkTracks": {
        "SDR": ["talk track 1", "talk track 2"],
        "AE": ["talk track 1", "talk track 2"]
      },
      "featureComparison": [
        {
          "feature": "Feature Name",
          "us": "Our capability",
          "competitors": {
            "Competitor A": "Their capability"
          }
        }
      ]
    }
    
    Our product: ${ourSummary}
    Competitors: ${JSON.stringify(competitors)}
    Target personas: ${personas.join(', ')}`;

    const response = await this.client!.chat.completions.create({
      model: "openrouter/sonoma-sky-alpha",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }
}

export const openaiService = new OpenAIService();