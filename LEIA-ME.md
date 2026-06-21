# MindTree — PWA (Progressive Web App)

## O que mudou

O MindTree deixou de ser um único arquivo `.html` e virou uma pequena pasta com
5 arquivos. Isso é necessário porque um PWA de verdade (instalável, com suporte
offline) precisa que o navegador encontre o `manifest.json` e o `sw.js` como
arquivos próprios, ao lado do `index.html` — não dá pra empacotar tudo dentro
de um único arquivo.

```
mindtree-pwa/
├── index.html        (a ferramenta em si — era o mindtree.html de antes)
├── manifest.json      (diz ao navegador como instalar: nome, ícones, cores)
├── sw.js               (service worker — permite funcionar offline)
├── favicon-192.png    (ícone do app, 192x192 — placeholder, troque pelo seu)
├── favicon-512.png    (ícone do app, 512x512 — placeholder, troque pelo seu)
└── favicon.ico         (ícone pra aba do navegador — placeholder)
```

## IMPORTANTE: troque os ícones placeholder

Os arquivos `favicon-192.png`, `favicon-512.png` e `favicon.ico` que vieram
junto são só placeholders de teste (um círculo azul simples). Troque pelo seu
`favicon.png` de verdade:

1. Coloque seu `favicon.png` (192x192) na pasta, substituindo `favicon-192.png`
2. Gere a versão 512x512 — qualquer editor de imagem serve (Preview no Mac,
   Paint no Windows, ou um site como squoosh.app), redimensionando o mesmo
   arquivo. Salve como `favicon-512.png`
3. Opcionalmente, gere um `favicon.ico` (32x32) a partir do mesmo ícone, pra
   aparecer na aba do navegador

## Como hospedar

PWAs **exigem HTTPS** (ou `localhost` para testes) — não funcionam abrindo o
arquivo direto no navegador (`file://`). Algumas opções simples e gratuitas
pra hospedar essa pasta:

- **Netlify Drop** (netlify.com/drop): arraste a pasta inteira, pronto, já
  fica no ar com HTTPS automático
- **GitHub Pages**: suba a pasta num repositório e ative o Pages
- **Vercel**: importe a pasta, deploy automático
- **Servidor próprio**: qualquer hospedagem com HTTPS funciona, só precisa
  servir os arquivos estáticos como estão (sem nenhuma configuração especial
  de servidor)

## Como instalar depois de hospedado

- **Celular (Android/Chrome)**: abra o link, vai aparecer um banner ou opção
  no menu "Adicionar à tela inicial" / "Instalar app"
- **Celular (iPhone/Safari)**: abra o link, toque no botão de compartilhar,
  "Adicionar à Tela de Início"
- **Computador (Chrome/Edge)**: abra o link, vai aparecer um ícone de
  instalação na barra de endereço (geralmente um ícone de tela com uma seta)

## Sobre o funcionamento offline

Depois da primeira vez que o app é aberto online, o service worker guarda os
arquivos principais em cache automaticamente. Da próxima vez, mesmo sem
internet, o MindTree abre normalmente. Os dados que você cria (árvores,
projetos salvos) já ficavam salvos no navegador local mesmo antes — isso não
muda.

Se você atualizar o `index.html` no futuro, abra o arquivo `sw.js` e mude o
texto `mindtree-v1` para `mindtree-v2` (ou qualquer outro nome), na primeira
linha de código — isso avisa o navegador que existe uma versão nova pra
baixar, em vez de continuar servindo a versão antiga do cache.
