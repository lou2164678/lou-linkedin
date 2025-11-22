// Using X.AI API with grok-4-fast model
import OpenAI from 'openai';

// AutoBrief AI system prompt from autobriefai_prompt.txt
const AUTOBRIEF_SYSTEM_PROMPT = `Your task is to generate a comprehensive, evidence-based brief for **{users_query}** in a specific two-part format.

**Objective:**

1.  First, produce a single, machine-readable JSON object containing detailed company data, strictly adhering to the provided schema.
2.  Second, immediately following the JSON block, produce a separate, human-readable report summarizing the same data, formatted in clean Markdown.

-----

### **Part 1: JSON Data Block**

Generate a single, valid JSON object for **{users_query}** that strictly follows the schema below.

**JSON Requirements:**

  * **Mandatory Citations:** Every factual claim must be supported by an inline \`source\` or \`sources\` object, including \`title\`, \`publisher\`, \`url\`, and \`date\` (YYYY-MM-DD).
  * **Source Quality:** Use only credible, recent sources (past 24 months preferred), such as official company statements, financial filings, top-tier media, or reputable industry analysis. Avoid Wikipedia, blogs, or forums.
  * **Handle Unknown Data:** If a required field cannot be found from credible sources, its value must be set to \`"unknown"\`. Provide a brief explanation for the missing data in the \`metadata.limitations\` array. **Never fabricate or use placeholders like "TBD."**
  * **Schema Adherence:** The final JSON object must match the structure, keys, and data types of the schema exactly. Do not add, remove, or rename any fields.

#### **JSON Schema**

\`\`\`json
{
  "company_profile": {
    "overview": {
      "company_name": "{users_query}",
      "founded": "YYYY or YYYY-MM-DD",
      "headquarters": "City, State/Country",
      "industry": "Primary industry classification",
      "employee_count": "Number or range",
      "mission_statement": "Quoted or summarized mission",
      "business_model": "How the company makes money",
      "sources": [
        {
          "title": "Source title",
          "publisher": "Publisher/Website",
          "url": "https://...",
          "date": "YYYY-MM-DD"
        }
      ]
    },
    "key_executives": [
      {
        "name": "Full Name",
        "position": "Job Title",
        "background": "Brief professional background",
        "source": {
          "title": "Source title",
          "publisher": "Publisher/Website",
          "url": "https://...",
          "date": "YYYY-MM-DD"
        }
      }
    ],
    "financials": {
      "revenue": "Latest annual revenue figure or 'unknown'",
      "funding": "Total funding/public status",
      "valuation": "Most recent valuation or 'unknown'",
      "profitability": "Profitability status/trend",
      "sources": [
        {
          "title": "Source title",
          "publisher": "Publisher/Website",
          "url": "https://...",
          "date": "YYYY-MM-DD"
        }
      ]
    },
    "recent_news": [
      {
        "headline": "News headline",
        "date": "YYYY-MM-DD",
        "summary": "1–2 sentence significance",
        "source": {
          "title": "Publication",
          "publisher": "Publisher/Website",
          "url": "https://...",
          "date": "YYYY-MM-DD"
        },
        "impact": "Potential business impact"
      }
    ]
  },
  "products_services": {
    "core_offerings": [
      {
        "name": "Product/Service name",
        "description": "Concise description",
        "features": ["feature1", "feature2", "feature3"],
        "target_audience": "Primary customer segment",
        "launch_date": "YYYY-MM-DD or 'unknown'",
        "source": {
          "title": "Source title",
          "publisher": "Publisher/Website",
          "url": "https://...",
          "date": "YYYY-MM-DD"
        }
      }
    ],
    "target_segments": [
      {
        "segment_name": "Market segment name",
        "description": "Segment characteristics",
        "size": "Market size estimate or 'unknown'",
        "growth_rate": "Annual growth rate or 'unknown'",
        "source": {
          "title": "Market research source",
          "publisher": "Publisher/Website",
          "url": "https://...",
          "date": "YYYY-MM-DD"
        }
      }
    ],
    "unique_value_propositions": [
      {
        "proposition": "Key value proposition",
        "supporting_evidence": "Evidence supporting the claim",
        "source": {
          "title": "Source title",
          "publisher": "Publisher/Website",
          "url": "https://...",
          "date": "YYYY-MM-DD"
        }
      }
    ]
  },
  "pricing_structure": {
    "pricing_models": [
      {
        "model_type": "SaaS, Usage-based, One-time, etc.",
        "description": "How pricing works",
        "price_range": "Price range or specific price if public",
        "billing_frequency": "Monthly/Annual/etc.",
        "source": {
          "title": "Pricing page or source",
          "publisher": "Publisher/Website",
          "url": "https://...",
          "date": "YYYY-MM-DD"
        }
      }
    ],
    "tiers": [
      {
        "tier_name": "Plan name",
        "price": "Specific price or 'unknown'",
        "features_included": ["feature1", "feature2"],
        "target_customer": "Intended customer type",
        "source": {
          "title": "Pricing source",
          "publisher": "Publisher/Website",
          "url": "https://...",
          "date": "YYYY-MM-DD"
        }
      }
    ],
    "competitive_positioning": {
      "market_position": "Premium/Mid-market/Budget/etc.",
      "price_comparison": "How prices compare vs competitors",
      "value_justification": "Why customers pay this price",
      "sources": [
        {
          "title": "Comparison source",
          "publisher": "Publisher/Website",
          "url": "https://...",
          "date": "YYYY-MM-DD"
        }
      ]
    }
  },
  "competitive_analysis": {
    "direct_competitors": [
      {
        "company_name": "Competitor name",
        "market_share": "Estimate or 'unknown'",
        "strengths": ["strength1", "strength2"],
        "weaknesses": ["weakness1", "weakness2"],
        "pricing_comparison": "Comparison vs {users_query} or 'unknown'",
        "differentiation": "Key differentiating factors",
        "source": {
          "title": "Source title",
          "publisher": "Publisher/Website",
          "url": "https://...",
          "date": "YYYY-MM-DD"
        }
      }
    ],
    "indirect_competitors": [
      {
        "company_name": "Alternative provider",
        "alternative_solution": "Alternative approach",
        "threat_level": "High/Medium/Low",
        "source": {
          "title": "Source title",
          "publisher": "Publisher/Website",
          "url": "https://...",
          "date": "YYYY-MM-DD"
        }
      }
    ],
    "competitive_advantages": [
      {
        "advantage": "Specific advantage",
        "description": "Why it matters",
        "sustainability": "Sustainability of advantage",
        "source": {
          "title": "Source title",
          "publisher": "Publisher/Website",
          "url": "https://...",
          "date": "YYYY-MM-DD"
        }
      }
    ],
    "threats": [
      {
        "threat": "Specific competitive threat",
        "impact_level": "High/Medium/Low",
        "timeline": "Time horizon or 'unknown'",
        "mitigation_strategy": "Likely/possible response",
        "source": {
          "title": "Source title",
          "publisher": "Publisher/Website",
          "url": "https://...",
          "date": "YYYY-MM-DD"
        }
      }
    ]
  },
  "market_position": {
    "market_size": {
      "total_addressable_market": "TAM estimate or 'unknown'",
      "serviceable_addressable_market": "SAM estimate or 'unknown'",
      "market_growth_rate": "Annual growth rate",
      "geographic_presence": ["Region1", "Region2"],
      "sources": [
        {
          "title": "Market research source",
          "publisher": "Publisher/Website",
          "url": "https://...",
          "date": "YYYY-MM-DD"
        }
      ]
    },
    "growth_trends": [
      {
        "trend": "Specific market trend",
        "impact": "Impact on {users_query}",
        "timeline": "Time horizon",
        "source": {
          "title": "Industry analysis source",
          "publisher": "Publisher/Website",
          "url": "https://...",
          "date": "YYYY-MM-DD"
        }
      }
    ],
    "key_opportunities": [
      {
        "opportunity": "Growth opportunity",
        "potential_impact": "Estimated business impact",
        "feasibility": "High/Medium/Low",
        "source": {
          "title": "Supporting analysis",
          "publisher": "Publisher/Website",
          "url": "https://...",
          "date": "YYYY-MM-DD"
        }
      }
    ],
    "challenges": [
      {
        "challenge": "Business challenge",
        "severity": "High/Medium/Low",
        "potential_solutions": ["solution1", "solution2"],
        "source": {
          "title": "Challenge source",
          "publisher": "Publisher/Website",
          "url": "https://...",
          "date": "YYYY-MM-DD"
        }
      }
    ]
  },
  "metadata": {
    "research_date": "YYYY-MM-DD",
    "data_freshness": "e.g., 'Most data within last 12 months'",
    "confidence_score": "High/Medium/Low (based on source quality and corroboration)",
    "key_sources": [
      {
        "title": "Key source title",
        "publisher": "Publisher/Website",
        "url": "https://...",
        "date": "YYYY-MM-DD"
      }
    ],
    "limitations": ["Brief limitation statements"],
    "follow_up_questions": ["Suggested next research questions"]
  }
}
\`\`\`

-----

### **Part 2: Markdown Report Block**

After generating the complete JSON object, create a separate, clean, and easily readable report using the data from the JSON.

**Markdown Formatting Rules:**

  * **Main Title:** Start with \`# Company Brief: {users_query}\`.
  * **Sections:** Use \`##\` headings for each major section (e.g., \`## 🏢 Company Profile\`, \`## 📊 Market Position\`). Using relevant emojis is encouraged.
  * **Clarity:** Use bolding for field labels (e.g., \`**Founded:**\`, \`**Headquarters:**\`).
  * **Lists:** Use bullet points (\`-\`) for lists of items like executives, news, products, and competitors.
  * **Citations:** For each piece of data, add a numbered, bracketed citation (e.g., \`[1]\`, \`[2]\`).
  * **Sources Section:** Conclude the entire report with a \`## 📚 Sources\` section. List all unique sources from the JSON, numbered to correspond with the citations in the text. Each source should be formatted as: \`[1] Title of Source, Publisher, YYYY-MM-DD. [URL]\``;

class OpenAIService {
  private client: OpenAI | null = null;

  initialize(apiKey?: string) {
    if (apiKey) {
      this.client = new OpenAI({
        apiKey,
        baseURL: "https://openrouter.ai/api/v1",
        dangerouslyAllowBrowser: true,
        defaultHeaders: {
          "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "",
          "X-Title": "Louis Sergiacomi Portfolio",
        },
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

    // Replace placeholder in system prompt with actual company name
    const systemPrompt = AUTOBRIEF_SYSTEM_PROMPT.replace(/{users_query}/g, companyName);

    const response = await this.client!.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate a comprehensive company brief for "${companyName}".` }
      ]
      // Note: Removed response_format to allow both JSON and Markdown output as specified in the system prompt
    });

    const content = response.choices[0].message.content || '';

    try {
      const comprehensiveData = this.extractJsonFromDualFormatResponse(content);
      // Transform the comprehensive schema to the format expected by the UI
      return this.transformComprehensiveToLegacySchema(comprehensiveData);
    } catch (error) {
      console.error('Failed to parse company brief response:', error);
      throw new Error('Failed to parse company brief response: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  private extractJsonFromDualFormatResponse(content: string): any {
    // Strategy 1: Try to extract from ```json fenced blocks (case-insensitive)
    const fencedJsonMatch = content.match(/```(?:json|JSON|Json|jsonc)\s*([\s\S]*?)\s*```/i);
    if (fencedJsonMatch) {
      try {
        return JSON.parse(fencedJsonMatch[1]);
      } catch (e) {
        // Continue to next strategy
      }
    }

    // Strategy 2: Try to extract from generic ``` fences
    const fencedMatch = content.match(/```\s*([\s\S]*?)\s*```/);
    if (fencedMatch) {
      try {
        return JSON.parse(fencedMatch[1]);
      } catch (e) {
        // Continue to next strategy
      }
    }

    // Strategy 3: Find balanced braces starting from first '{'
    const firstBrace = content.indexOf('{');
    if (firstBrace !== -1) {
      let braceCount = 0;
      let inString = false;
      let escaped = false;

      for (let i = firstBrace; i < content.length; i++) {
        const char = content[i];

        if (escaped) {
          escaped = false;
          continue;
        }

        if (char === '\\') {
          escaped = true;
          continue;
        }

        if (char === '"' && !escaped) {
          inString = !inString;
          continue;
        }

        if (!inString) {
          if (char === '{') {
            braceCount++;
          } else if (char === '}') {
            braceCount--;
            if (braceCount === 0) {
              try {
                return JSON.parse(content.substring(firstBrace, i + 1));
              } catch (e) {
                // Continue to fallback
              }
            }
          }
        }
      }
    }

    // Strategy 4: Fallback - try to parse entire content as JSON
    try {
      return JSON.parse(content);
    } catch (e) {
      throw new Error('No valid JSON found in response');
    }
  }

  private transformComprehensiveToLegacySchema(data: any): any {
    // Handle error responses
    if (data.error) {
      return data;
    }

    try {
      // Extract data from the comprehensive schema and map to legacy format
      const company = data.company_profile?.overview || {};
      const keyExecutives = data.company_profile?.key_executives || [];
      const coreOfferings = data.products_services?.core_offerings || [];
      const recentNews = data.company_profile?.recent_news || [];

      // Transform to legacy schema format
      return {
        company: {
          name: company.company_name || 'Unknown Company',
          website: this.extractFirstUrl(company.sources) || undefined,
          industry: company.industry || 'Unknown Industry',
          size: company.employee_count || 'Unknown Size',
          headquarters: company.headquarters || 'Unknown Location'
        },
        keyPeople: keyExecutives.map((exec: any) => ({
          name: exec.name || 'Unknown',
          title: exec.position || 'Unknown Position',
          background: exec.background || undefined
        })),
        businessModel: {
          description: company.business_model || 'Not available',
          revenue: data.company_profile?.financials?.revenue || 'Unknown',
          keyProducts: coreOfferings.map((offering: any) => offering.name).filter(Boolean) || []
        },
        painPoints: this.extractInsightsFromSections(data, 'challenges') || [],
        talkingPoints: this.extractInsightsFromSections(data, 'opportunities') || [],
        competitiveLandscape: this.extractCompetitorNames(data) || [],
        recentNews: recentNews.map((news: any) => news.headline || news.summary).filter(Boolean) || []
      };
    } catch (transformError) {
      console.error('Failed to transform comprehensive schema:', transformError);
      // Return a fallback structure to prevent UI crashes
      return {
        company: {
          name: 'Error parsing response',
          industry: 'Unknown',
          size: 'Unknown',
          headquarters: 'Unknown'
        },
        keyPeople: [],
        businessModel: {
          description: 'Error parsing response',
          revenue: 'Unknown',
          keyProducts: []
        },
        painPoints: [],
        talkingPoints: [],
        competitiveLandscape: [],
        recentNews: []
      };
    }
  }

  private extractFirstUrl(sources: any[]): string | null {
    if (!Array.isArray(sources)) return null;
    const firstSource = sources[0];
    return firstSource?.url || null;
  }

  private extractInsightsFromSections(data: any, type: 'challenges' | 'opportunities'): string[] {
    const insights: string[] = [];

    // Extract from market position section
    const marketPosition = data.market_position || {};
    const items = marketPosition[`key_${type}`] || [];
    items.forEach((item: any) => {
      if (type === 'challenges' && item.challenge) {
        insights.push(item.challenge);
      } else if (type === 'opportunities' && item.opportunity) {
        insights.push(item.opportunity);
      }
    });

    // Extract from competitive advantages (for opportunities)
    if (type === 'opportunities') {
      const competitive = data.competitive_analysis?.competitive_advantages || [];
      competitive.forEach((advantage: any) => {
        if (advantage.advantage) {
          insights.push(advantage.advantage);
        }
      });
    }

    // Extract from threats (for challenges)
    if (type === 'challenges') {
      const threats = data.competitive_analysis?.threats || [];
      threats.forEach((threat: any) => {
        if (threat.threat) {
          insights.push(threat.threat);
        }
      });
    }

    return insights.slice(0, 5); // Limit to 5 items for UI
  }

  private extractCompetitorNames(data: any): string[] {
    const competitors: string[] = [];

    const directCompetitors = data.competitive_analysis?.direct_competitors || [];
    const indirectCompetitors = data.competitive_analysis?.indirect_competitors || [];

    directCompetitors.forEach((comp: any) => {
      if (comp.company_name) {
        competitors.push(comp.company_name);
      }
    });

    indirectCompetitors.forEach((comp: any) => {
      if (comp.company_name) {
        competitors.push(`${comp.company_name} (indirect)`);
      }
    });

    return competitors.slice(0, 5); // Limit to 5 competitors for UI
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
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }
}

export const openaiService = new OpenAIService();