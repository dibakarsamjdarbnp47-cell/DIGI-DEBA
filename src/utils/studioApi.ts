import type { WorkspaceLanguage } from '../types/studio';

export async function generateStudioOutput<T>(
  studio: string,
  promptInput: string,
  language: WorkspaceLanguage
): Promise<T> {
  const res = await fetch('/api/ai/studio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studio, promptInput, language }),
  });

  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload.error || 'Failed to generate studio output.');
  }

  return payload.data as T;
}
