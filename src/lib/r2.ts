// R2 Storage utilities for quotes
// Configure WORKER_URL to your Cloudflare Worker that handles R2 uploads

export const WORKER_URL = 'https://loom-upload.ben-6a6.workers.dev';
export const R2_BASE = 'https://pub-17ea8d32c4a94a5fbc8eb9a70e6047a8.r2.dev';

export type R2LoadResult<T> =
  | { status: 'success'; data: T }
  | { status: 'empty' }
  | { status: 'error'; message: string };

export async function loadFromR2<T>(filename: string): Promise<R2LoadResult<T>> {
  try {
    // Load via worker endpoint to bypass R2 public access issues
    const response = await fetch(`${WORKER_URL}?file=${filename}&t=${Date.now()}`);
    if (response.ok) {
      const data = await response.json();
      return { status: 'success', data };
    }
    if (response.status === 404) {
      return { status: 'empty' };
    }
    return { status: 'error', message: `Server returned ${response.status}` };
  } catch (e) {
    console.error(`Failed to load ${filename}:`, e);
    return { status: 'error', message: e instanceof Error ? e.message : 'Network error' };
  }
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

export async function uploadVideoToR2(filename: string, blob: Blob): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('video', blob, filename);
    formData.append('type', 'recording');

    const response = await fetch(WORKER_URL, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    if (result.success && result.url) {
      return result.url;
    }
    return null;
  } catch (e) {
    console.error(`Failed to upload video ${filename}:`, e);
    return null;
  }
}
