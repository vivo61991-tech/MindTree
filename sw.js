// Service Worker do MindTree — permite o app funcionar OFFLINE depois da
// primeira visita, guardando em cache os arquivos locais (index.html,
// manifest, ícones) e as bibliotecas externas (D3, SheetJS) usadas pela
// ferramenta. Sempre que uma versão nova for publicada, suba o número do
// CACHE_VERSION abaixo — isso força o navegador a baixar tudo de novo.

const CACHE_VERSION = 'mindtree-v2';

// arquivos do próprio app, sempre disponíveis localmente
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './favicon-192.png',
  './favicon-512.png',
];

// bibliotecas externas usadas pela ferramenta — cacheadas sob demanda
// (na primeira vez que forem carregadas com sucesso), pra funcionar offline
// depois de uma primeira visita online
const EXTERNAL_LIBS = [
  'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      // tenta cachear o essencial do app; não falha a instalação inteira
      // se algum arquivo externo não carregar nesse momento (rede instável)
      return cache.addAll(APP_SHELL).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // só intercepta GET — outros métodos passam direto pra rede
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // serve do cache imediatamente, e atualiza o cache em segundo plano
        // (estratégia "stale-while-revalidate") quando há rede disponível
        fetchAndCache(request);
        return cached;
      }
      // não está em cache ainda: busca na rede e guarda pra próxima vez
      return fetchAndCache(request).catch(() => {
        // sem rede e sem cache: se for navegação de página, cai no index
        if (request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return new Response('', { status: 408, statusText: 'Offline' });
      });
    })
  );
});

function fetchAndCache(request) {
  return fetch(request).then((response) => {
    // só guarda respostas válidas (evita cachear erros 404/500)
    if (response && response.status === 200) {
      const responseClone = response.clone();
      caches.open(CACHE_VERSION).then((cache) => cache.put(request, responseClone));
    }
    return response;
  });
}
