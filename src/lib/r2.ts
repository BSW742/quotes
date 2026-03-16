// R2 Storage utilities for quotes
// Configure WORKER_URL to your Cloudflare Worker that handles R2 uploads

export const WORKER_URL = 'https://loom-upload.ben-6a6.workers.dev';
export const R2_BASE = 'https://pub-17ea8d32c4a94a5fbc8eb9a70e6047a8.r2.dev';

export async function loadFromR2<T>(filename: string): Promise<T | null> {
  try {
    const response = await fetch(`${R2_BASE}/${filename}?t=${Date.now()}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.error(`Failed to load ${filename}:`, e);
  }
  return null;
}

export async function saveToR2(filename: string, data: unknown): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append(
      'json',
      new Blob([JSON.stringify(data)], { type: 'application/json' }),
      filename
    );
    formData.append('type', 'quotes-data');

    const response = await fetch(WORKER_URL, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    return result.success === true;
  } catch (e) {
    console.error(`Failed to save ${filename}:`, e);
    return false;
  }
}
