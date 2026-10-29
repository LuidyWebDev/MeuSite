# LUIDY HENRIQUE // Design System (`DESIGN.md`)

## 1. Direção
- **Identidade**: LUIDY HENRIQUE // DESENVOLVIMENTO WEB
- **Arquétipo**: *Monochrome Minimal* — preto, branco e cinzas neutros. Sem neon, sem cores saturadas. A ênfase vem de peso tipográfico, contraste e movimento suave do shader da Hero.
- **Temas**: Dark (padrão, fundo `#000000`) e Light (fundo `#FFFFFF`), alternados pelo Dock e pelo switch do rodapé.

## 2. Paleta
| Papel | Dark | Light |
| :--- | :--- | :--- |
| Fundo | `#000000` | `#FFFFFF` |
| Superfície (cards) | `#0D0D0F` | `neutral-100` `#F5F5F5` |
| Borda | `neutral-800` `#262626` | `neutral-200` `#E5E5E5` |
| Texto principal | `#FFFFFF` | `neutral-950` `#0A0A0A` |
| Texto secundário | `neutral-400` `#A3A3A3` | `neutral-600` `#525252` |
| Botão primário | fundo branco / texto preto | fundo `neutral-950` / texto branco |

## 3. Hero
- **[`ShaderHero`](file:///d:/Sites%20Projetos/Antigravity/src/components/ui/shader-hero.tsx)** (adaptado de `beratberkayg/shader-hero`): duas camadas de mesh gradient em WebGL2 (`speed` 0.25 e 0.15, a segunda com 40% de opacidade), título animado letra a letra, badge em vidro e dois CTAs.
- Paleta do shader: Dark `#000 → #1a1a1a → #2e2e2e → #fff`; Light `#fff → #f4f4f5 → #d4d4d8 → #27272a`.

## 4. Imagens
- As imagens dos projetos e o retrato são exibidos em cores naturais, sem filtro preto e branco.
- A página inicial usa a identidade, o retrato, os contatos e os perfis reais de Luidy Henrique; os quatro cards e seus previews contêm modelos demonstrativos fictícios.
