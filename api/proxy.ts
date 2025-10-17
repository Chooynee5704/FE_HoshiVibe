// Vercel Serverless Function (Vite/React cũng dùng được)
import type { VercelRequest, VercelResponse } from '@vercel/node';

const TARGET = 'http://hoshi-vibe-site.somee.com/api';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const path = (req.query.path as string[] | undefined)?.join('/') ?? '';
    const url = `${TARGET}/${path}`;

    const fetchRes = await fetch(url, {
      method: req.method,
      headers: {
        // forward content-type & auth if có
        'content-type': req.headers['content-type'] || 'application/json',
        authorization: req.headers['authorization'] as string || '',
      },
      body: ['GET', 'HEAD'].includes(req.method || '') ? undefined : (req as any).body,
    });

    const text = await fetchRes.text();
    res.status(fetchRes.status);
    // copy lại content-type
    res.setHeader('content-type', fetchRes.headers.get('content-type') || 'application/json');
    res.send(text);
  } catch (e: any) {
    res.status(500).json({ message: e?.message || 'Proxy error' });
  }
}
