# Conselho do Dia

**Estoicismo para a vida real.** Uma ideia para refletir. Uma ação para praticar.

Um pequeno ritual diário de 1–2 minutos: **uma reflexão, uma pergunta, uma pequena ação** — com a fonte de cada citação indicada e verificada.

🔗 **Site no ar:** https://kaua698.github.io/estoicismobased/

<p align="center">
  <img src="assets/screenshot-mobile.png" alt="Tela Hoje no celular: conselho de Sêneca com fonte verificada e a pergunta do dia" width="260">
  &nbsp;&nbsp;
  <img src="assets/screenshot-desktop.png" alt="Tela Hoje no desktop, com a lateral Seu ritmo" width="560">
</p>

---

## Por que fiz

Comecei como um gerador de frases estoicas para treinar JavaScript. Pesquisando as frases, descobri que várias das mais compartilhadas na internet **não são de quem dizem ser** — uma delas é fala do filme *Gladiador*. Isso virou o centro do projeto: um espaço de reflexão que leva a sério de onde vem cada ideia, e que ajuda a praticar, não só a ler.

## Funcionalidades

- **Conselho do dia** — o mesmo durante o dia inteiro, com explicação, uma pergunta e uma ação de poucos minutos
- **Selo de confiança da fonte** — cada citação aparece como *verificada*, *paráfrase*, *atribuição incerta* ou *interpretação moderna*
- **Explorar** — 10 temas e um atalho “O que está acontecendo com você hoje?”
- **Minhas reflexões** — histórico, salvos, respostas e um ritmo de prática do mês, sem sequência nem punição
- **Prática** — 8 exercícios estoicos e o “Preciso de perspectiva”, que treina separar o que depende de você do que não depende
- **Frases que não são estoicas** — as atribuições falsas da primeira versão, explicadas em vez de apagadas
- **Compartilhar** — usa o compartilhamento nativo do celular ou copia o texto
- **Privacidade** — tudo fica no navegador, com exportar (JSON) e apagar dados

## Decisões técnicas

| Decisão | Por quê |
|---|---|
| **HTML, CSS e JavaScript puro, sem dependências** | O projeto é pequeno; um framework só traria peso. Abre com duplo clique no `index.html`. |
| **Páginas HTML separadas** | URLs próprias e textos fixos no HTML, bons para SEO, em vez de uma SPA montada por JavaScript. |
| **Conselho diário determinístico** | O conselho é escolhido pela data e gravado no navegador; recarregar não troca, e adicionar conteúdo não muda o conselho de quem já abriu o site no dia. |
| **Modelo de conteúdo com status da fonte** | Cada reflexão tem `type` (`quote` ou `modern`) e `sourceStatus`. Referências só entram quando confirmadas. |
| **localStorage com schema versionado** | Reflexões pessoais não saem do navegador. Sem conta, servidor ou banco de dados. |
| **Conteúdo dinâmico só com `textContent`** | Nada de `innerHTML` com dados — evita injeção de HTML. |
| **Design tokens em CSS** | Cores, fontes e raios definidos em `:root`; nenhuma cor solta no resto do CSS. |
| **Acessibilidade** | HTML semântico, foco visível, `aria-pressed` e `aria-live`, estados com ícone + texto (não só cor), contraste AA e `prefers-reduced-motion`. |

## Como rodar

Não precisa instalar nada.

```bash
git clone https://github.com/kaua698/estoicismobased.git
cd estoicismobased
# abra o index.html no navegador
```

Ou, para servir localmente:

```bash
npx serve .
```

## Estrutura

```
.
├── index.html        Hoje — conselho do dia
├── explorar.html     Temas e "o que está acontecendo com você"
├── reflexoes.html    Histórico, salvos e ritmo
├── pratica.html      Exercícios e "Preciso de perspectiva"
├── sobre.html        Fontes, frases falsas, privacidade
├── style.css         Estilos e design tokens
├── data.js           Conteúdo: reflexões, temas, situações
├── storage.js        Tudo de localStorage
├── script.js         Lógica de cada página
└── assets/           Favicon e screenshots
```

### Adicionar uma reflexão

Acrescente um objeto ao final de `REFLEXOES` em `data.js`:

```js
{
  id: "slug-unico",            // nunca reaproveitar
  type: "quote",               // ou "modern" (sem autor)
  sourceStatus: "verified",    // "paraphrase", "uncertain" ou null em "modern"
  title: "Título curto",
  text: "A citação ou o conselho.",
  author: "Sêneca", work: "Cartas a Lucílio", reference: "13.4", // reference só se confirmada
  theme: "ansiedade",          // um id de TEMAS
  explanation: "2–3 frases.",
  question: "Uma pergunta.",
  action: "Uma ação que cabe no dia.",
  minutes: 2
}
```

## Design

Paleta carvão e marfim com bronze só para destaque; *Newsreader* para os textos filosóficos e *Instrument Sans* para a interface. Mobile-first, com navegação inferior no celular e coluna de leitura com lateral discreta no desktop. O design foi feito no Claude Design antes da implementação.

## Roadmap

- [x] Redesign: Hoje, Explorar, Reflexões, Prática e Sobre
- [x] Revisão das citações e sistema de confiança das fontes
- [ ] PWA: instalar no celular e funcionar offline
- [ ] Mais reflexões, até chegar a uma por dia do ano
- [ ] Mais situações no “Preciso de perspectiva”

## Sobre o conteúdo

Este é um espaço de reflexão e estudo, não de terapia nem aconselhamento profissional. Se algo estiver difícil demais, procure apoio: **CVV — ligue 188** (24h, gratuito) ou [cvv.org.br](https://cvv.org.br).

## Autor

Feito por **Kauã** — [github.com/kaua698](https://github.com/kaua698)
