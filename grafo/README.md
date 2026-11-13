# Grafo de Teste — Luniar

Este grafo tem ~20 obras e materiais ligados por temas, conceitos e autores.

## Como usar no Obsidian

1. Crie uma pasta `grafo` no seu vault do Obsidian.
2. Cole o conteúdo de `nos.json` em um arquivo `.json` (ou use o plugin **Dataview** para ler).
3. Para cada nó, crie uma nota com frontmatter:

```yaml
---
tipo: obra  # ou tema, conceito, autor, material
nome: Persona 5
ano: 2016
tags: [grafo, obra]
---
```

4. Ligue as notas com `[[wikilinks]]` seguindo as arestas do JSON.

## Exemplo de consulta (Dataview)

```dataview
TABLE tipo, ano
FROM #grafo
WHERE tipo = "obra"
```

## Estrutura das arestas

- `inspirou`: obra → autor/conceito (origem da obra)
- `trata_do_tema`: obra → tema/conceito
- `dialoga_com`: obra ↔ obra (lateral, outra mídia)
- `desenvolvido_por`: obra → autor
- `referencia`: material → obra/conceito
- `aprofunda`: material → tema/conceito

## Trilha exemplo: Persona 5

1. **leve** — Introdução à Psicologia (documentário) — aprofunda psicologia
2. **medio** — O Homem e Seus Símbolos (livro, Jung) — origem, inspiração direta
3. **denso** — Mapas da Significação (livro, Peterson) — aprofunda cognição
4. **lateral** — Matrix (filme) — dialoga com tema de máscara/persona
