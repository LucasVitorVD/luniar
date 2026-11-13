# Modelo do Grafo — Luniar

## Tipos de nó

| Tipo | Exemplo |
|------|---------|
| Obra | Persona 5, Kingdom Hearts |
| Tema | cognição, conexões |
| Conceito | persona, sombra |
| Autor | Jung, Lupin |
| Material | livro, documentário, artigo |

## Tipos de relação

| Relação | Significado | Direção |
|---------|-------------|---------|
| inspirou | A obra foi inspirada por… | Obra → Nó |
| trata_do_tema | A obra aborda… | Obra → Tema/Conceito |
| dialoga_com | A obra conversa com… | Obra ↔ Obra |
| desenvolvido_por | Criador da obra | Obra → Autor |
| referencia | O material cita… | Material → Obra/Conceito |
| aprofunda | Material vai fundo em… | Material → Tema/Conceito |

## Regras da trilha (MVP)

- 4 a 5 itens, no máximo um por tipo
- Ordenado do mais leve ao mais denso (leve, médio, denso)
- Pelo menos um item de **origem** (de onde a obra veio)
- Pelo menos um item **lateral** (outra mídia similar)
- Cada item tem: por que está aqui, nível, capa, autor, ano, sinopse curta, onde encontrar
