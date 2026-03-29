// Cloudflare Worker for R2 storage
// Deploy with: wrangler deploy
// Requires R2 bucket binding named 'BUCKET'

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // GET - fetch file from R2
    if (request.method === 'GET') {
      const filename = url.searchParams.get('file');
      if (!filename) {
        return new Response(JSON.stringify({ error: 'No file specified' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const object = await env.BUCKET.get(filename);
      if (!object) {
        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const headers = new Headers(corsHeaders);
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);

      return new Response(object.body, { headers });
    }

    // POST - upload file to R2
    if (request.method === 'POST') {
      try {
        const formData = await request.formData();
        const type = formData.get('type');

        // Handle JSON data (quotes, recordings metadata, etc.)
        const jsonFile = formData.get('json');
        if (jsonFile) {
          const filename = jsonFile.name;
          const content = await jsonFile.text();
          await env.BUCKET.put(filename, content, {
            httpMetadata: { contentType: 'application/json' }
          });
          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Handle video uploads
        const videoFile = formData.get('video');
        if (videoFile && type === 'recording') {
          const filename = videoFile.name;
          const buffer = await videoFile.arrayBuffer();

          await env.BUCKET.put(`recordings/${filename}`, buffer, {
            httpMetadata: { contentType: 'video/webm' }
          });

          // Return the public URL
          const publicUrl = `https://pub-17ea8d32c4a94a5fbc8eb9a70e6047a8.r2.dev/recordings/${filename}`;

          return new Response(JSON.stringify({
            success: true,
            url: publicUrl,
            filename: filename
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({ error: 'No valid file provided' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }
};
