const BLOCK_PREFIXES = ['/scripts', '/templates', '/reports', '/config', '/guides_backup', '/lib'];
const BLOCK_FILES = [
  '/package.json',
  '/build.js',
  '/server.js',
  '/.env.example',
  '/data/catalog-policy.json',
];

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === 'www.fastimgtool.com') {
    url.hostname = 'fastimgtool.com';
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const blockedFile = BLOCK_FILES.includes(path);
  const blockedPrefix = BLOCK_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix + '/'));
  if (blockedFile || blockedPrefix) {
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
