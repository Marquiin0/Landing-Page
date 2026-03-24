# Landing Page - Sabor da Esquina

## Projeto
Landing Page de lanchonete brasileira para portfólio. Stack: TypeScript + HTML5 + CSS3 puro + Vite.

## Identidade
- **Nome:** Sabor da Esquina
- **Tagline:** "Desde 2005, o melhor lanche da cidade"
- **Idioma:** pt-BR (`<html lang="pt-BR">`)

## Paleta de Cores
| Token | Cor | Uso |
|---|---|---|
| `--color-primary` | `#FF6B35` (laranja) | CTAs, destaques, interações |
| `--color-primary-dark` | `#E55A2B` | Hover states |
| `--color-secondary` | `#2D1B0E` (marrom) | Textos, seções escuras |
| `--color-accent` | `#F5C518` (amarelo) | Badges, acentos |
| `--color-bg-light` | `#FFF8F0` (creme) | Background principal |
| `--color-bg-dark` | `#1A0F07` | Seções escuras |

## Fontes
- **Títulos:** Playfair Display 700
- **Corpo:** Inter 400, 500, 600
- **Destaques:** Poppins 600, 700

## Comandos
```bash
npm run dev      # Dev server com HMR
npm run build    # Build de produção (tsc + vite build)
npm run preview  # Preview do build local
```

## Estrutura
```
src/
├── main.ts              # Entry point - inicializa módulos
├── styles/              # CSS modular (main.css importa todos)
│   ├── _variables.css   # Design tokens
│   ├── _reset.css       # CSS reset
│   ├── _typography.css  # Fontes
│   ├── _animations.css  # @keyframes + [data-animate]
│   ├── _utilities.css   # Helpers
│   ├── _responsive.css  # Media queries
│   └── components/      # CSS por seção
├── modules/             # Classes TS por funcionalidade
├── utils/               # Helpers (dom, throttle, easing)
└── data/                # Dados do cardápio
```

## Padrões
- **Animações:** CSS-first. TS apenas toggle classes ou seta CSS vars.
- **Scroll animations:** IntersectionObserver + `[data-animate]` → `.revealed`
- **Módulos:** Cada um implementa `init()` e opcional `destroy()`
- **Responsivo:** Mobile-first com `clamp()` + media queries min-width
- **Acessibilidade:** Semantic HTML, ARIA, prefers-reduced-motion
- **Performance:** lazy loading, preload hero, will-change dinâmico, throttle scroll

## Deploy
GitHub Pages via GitHub Actions. Base path: `/Landing-Page/`
Repositório: https://github.com/Marquiin0/Landing-Page

## Git - Processo Automático
**SEMPRE que houver alterações no projeto, faça o commit e push automaticamente seguindo este fluxo:**

1. `git add` dos arquivos relevantes (nunca incluir node_modules, dist, .env ou credenciais)
2. `git commit` com mensagem descritiva em português seguindo o padrão:
   - `feat:` para novas funcionalidades
   - `fix:` para correções
   - `perf:` para melhorias de performance
   - `style:` para mudanças visuais/CSS
   - `refactor:` para refatorações
   - `docs:` para documentação
   - `chore:` para manutenção
3. `git push origin main`

**Não peça confirmação para fazer commit/push — faça automaticamente após concluir cada tarefa.**
Branch principal: `main`
Remote: `origin` → https://github.com/Marquiin0/Landing-Page.git
