# Hub de Ferramentas do RH · Budel Transportes

Página independente que reúne as rotinas mensais do RH (People Analytics).
Usa o CSS/JS do Tabler 1.7.3 (a mesma versão deste fork) e os ícones do Tabler Icons via CDN,
com a identidade visual Budel por cima. Não precisa de build nem de Node.js.

## Como abrir

Abra `index.html` no navegador, ou publique a pasta `budel-hub/` num servidor web
(GitHub Pages, IIS, pasta compartilhada com servidor). É preciso acesso à internet para carregar
o Tabler a partir do `cdn.jsdelivr.net`.

## Arquivos

| Arquivo | O que tem |
| --- | --- |
| `index.html` | Estrutura da tela com componentes do Tabler (navbar, page-header, cards, status, list-group, footer) |
| `css/budel.css` | Tema Budel: fonte Calibri, preto e vermelho Budel, calendário e ajustes |
| `js/rotinas.js` | **Lista de rotinas**: nome, categoria, descrição, dia limite, ícone e link |
| `js/app.js` | Resumo, cards, status, busca (Ctrl+K), seletor de mês e calendário |

## Como manter

- **Incluir ou alterar uma rotina:** edite `js/rotinas.js`. Uma categoria nova vira uma seção nova.
- **Botão "Abrir":** preencha `link` de cada rotina. Enquanto for `#`, o botão fica desabilitado.
- **Cor oficial:** troque `--budel-red` e `--tblr-primary-rgb` no topo de `css/budel.css`.
- **Logo:** substitua o bloco `budel-logo` no cabeçalho de `index.html` por um `<img>` com a logo.

## Regras de status

- **Concluído:** marcado com "Marcar como feito" no mês selecionado.
- **Atrasado:** não concluído e com dia limite antes de hoje.
- **Pendente:** os demais.

O status concluído é guardado **no navegador de quem marca** (localStorage, separado por mês).
Para a equipe inteira enxergar o mesmo status, é preciso um armazenamento compartilhado
(por exemplo SharePoint/Lista, planilha ou uma API), que pode ser ligado depois em `js/app.js`.
