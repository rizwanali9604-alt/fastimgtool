const BLOCK_PREFIXES = ['/scripts', '/templates', '/reports', '/config', '/guides_backup'];

export async function onRequest(context) {
  const path = new URL(context.request.url).pathname.replace(/\/+$/, '') || '/';
  const blocked = BLOCK_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix + '/'));
  if (blocked) {
    return new Response('Not Found', {
      status: 404,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'x-robots-tag': 'noindex, nofollow',
        'cache-control': 'no-store',
      },
    });
  }
  return context.next();
}
