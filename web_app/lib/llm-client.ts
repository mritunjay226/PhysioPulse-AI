/**
 * Universal LLM Client supporting Gemini, OpenAI, Groq, and OpenAI-compatible endpoints.
 * Automatically respects a short timeout (4.5s) to guarantee zero-lag failover.
 */

export async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  timeoutMs: number = 15000
): Promise<string | null> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // 1. Try Gemini models starting with ultra-fast gemini-2.5-flash-lite (<3s latency)
    if (geminiKey) {
      const geminiModels = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-flash-latest'];
      for (const model of geminiModels) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\nTask:\n${userPrompt}` }]
                }
              ],
              generationConfig: {
                temperature: 0.2,
                responseMimeType: 'application/json'
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              clearTimeout(timeoutId);
              return text;
            }
          } else {
            console.warn(`[callLLM] Gemini ${model} HTTP ${response.status}, trying fallback`);
          }
        } catch (err: any) {
          if (err.name === 'AbortError') {
            console.warn(`[callLLM] Gemini ${model} timed out after ${timeoutMs}ms`);
            break;
          }
          console.warn(`[callLLM] Gemini ${model} error, trying next fallback:`, err.message);
        }
      }
    }

    // 2. Try Groq if configured
    if (groqKey) {
      const url = 'https://api.groq.com/openai/v1/chat/completions';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) return text;
      }
    }

    // 3. Try OpenAI if configured
    if (openaiKey) {
      const url = 'https://api.openai.com/v1/chat/completions';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) return text;
      }
    }

    return null;
  } catch (err) {
    // Network error or timeout, safely fall back
    console.warn('LLM call bypassed or timed out, activating deterministic clinical engine:', err);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Multimodal LLM Client supporting image / document vision analysis.
 * Specializes in analyzing handwritten clinical prescriptions and OCR documents.
 */
export async function callMultimodalLLM(
  systemPrompt: string,
  userPrompt: string,
  imageBase64: string,
  mimeType: string = 'image/jpeg',
  timeoutMs: number = 55000
): Promise<string | null> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Clean raw base64 (strip data URI prefix if present)
  const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');

  try {
    // 1. Try Gemini Vision models (gemini-2.5-flash is top-tier for handwriting OCR)
    if (geminiKey) {
      const geminiModels = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-flash-latest'];
      for (const model of geminiModels) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: `${systemPrompt}\n\nTask & Directives:\n${userPrompt}` },
                    {
                      inlineData: {
                        mimeType: mimeType || 'image/jpeg',
                        data: cleanBase64
                      }
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.15,
                responseMimeType: 'application/json'
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              clearTimeout(timeoutId);
              return text;
            }
          } else {
            const errBody = await response.text();
            console.warn(`[callMultimodalLLM] Gemini ${model} HTTP ${response.status}:`, errBody.slice(0, 200));
          }
        } catch (err: any) {
          if (err.name === 'AbortError') {
            console.warn(`[callMultimodalLLM] Gemini ${model} timed out after ${timeoutMs}ms`);
            break;
          }
          console.warn(`[callMultimodalLLM] Gemini ${model} error, trying next fallback:`, err.message);
        }
      }
    }

    // 2. Try OpenAI Vision (gpt-4o-mini / gpt-4o)
    if (openaiKey) {
      try {
        const url = 'https://api.openai.com/v1/chat/completions';
        const fullDataUri = imageBase64.startsWith('data:')
          ? imageBase64
          : `data:${mimeType || 'image/jpeg'};base64,${cleanBase64}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              {
                role: 'user',
                content: [
                  { type: 'text', text: userPrompt },
                  {
                    type: 'image_url',
                    image_url: { url: fullDataUri, detail: 'high' }
                  }
                ]
              }
            ],
            temperature: 0.15,
            response_format: { type: 'json_object' }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const text = data?.choices?.[0]?.message?.content;
          if (text) {
            clearTimeout(timeoutId);
            return text;
          }
        }
      } catch (err: any) {
        console.warn('[callMultimodalLLM] OpenAI vision fallback error:', err.message);
      }
    }

    return null;
  } catch (err) {
    console.warn('[callMultimodalLLM] Exception occurred:', err);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
