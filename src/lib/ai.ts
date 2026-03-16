// AI utilities for quotes app
// Uses Anthropic Claude API via Cloudflare Worker or direct API calls

export interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
}

// Option 1: Direct Anthropic API (requires API key)
export async function callClaude(prompt: string, apiKey: string): Promise<AIResponse> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (data.content?.[0]?.text) {
      return { success: true, content: data.content[0].text };
    }

    return { success: false, error: data.error?.message || 'Unknown error' };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

// Option 2: Via Cloudflare Worker (no API key exposed to client)
export async function callAIWorker(
  workerUrl: string,
  prompt: string
): Promise<AIResponse> {
  try {
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    return await response.json();
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
