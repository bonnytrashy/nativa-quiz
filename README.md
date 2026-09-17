# Desafio Brotinho · Nativa

Landing page com quiz da nova linha **Brotinho** da Nativa. Os participantes recebem pistas sobre os ativos da fragrancia e deixam seu palpite. As primeiras pessoas que acertarem sao convidadas para uma acao de conteudo com a marca.

## Versoes

| Rota | Publico | Vagas |
|------|---------|-------|
| `/b2c` | Consumidor final | 3 primeiras pessoas |
| `/b2b` | Parceiros / empresas | 2 primeiras pessoas |

A rota raiz `/` mostra um seletor entre as duas versoes.

## Fluxo do quiz

1. Introducao da acao
2. Dados de contato: nome completo, @ do Instagram, WhatsApp
3. Pista 1: ativo de casca alaranjada e aroma fresco
4. Pista 2: fruta citrica menor, aroma doce
5. Palpite final: quais sao os ativos
6. Motivo para participar
7. Disposicao para gravar conteudo (so avanca quem responde **Sim**)
8. Envio e tela de confirmacao

## Envio das respostas

Todas as respostas (B2B e B2C) sao enviadas via `POST` (JSON) para o webhook n8n:

```
https://n8n.protocolopentagono.com.br/webhook/9d0a76cd-9c4f-49db-8f6b-34b7df7eadcf
```

Exemplo de payload:

```json
{
  "variante": "b2c",
  "vagas": 3,
  "nome": "",
  "instagram": "",
  "whatsapp": "",
  "resposta_pista_1": "",
  "resposta_pista_2": "",
  "palpite_final": "",
  "motivo": "",
  "disposta_a_gravar": "Sim",
  "origem": "https://.../b2c",
  "enviado_em": "2026-09-17T00:00:00.000Z"
}
```

## Estrutura

```
.
├── index.html          # seletor de versao
├── b2b/index.html      # quiz B2B (config inline)
├── b2c/index.html      # quiz B2C (config inline)
├── assets/
│   ├── logo.webp       # logo Nativa
│   ├── styles.css      # estilos compartilhados
│   └── quiz.js         # motor do quiz (renderiza a partir do NATIVA_CONFIG)
└── vercel.json         # rotas /b2b e /b2c + cache
```

## Deploy

Site estatico. Basta importar o repositorio na Vercel (sem build), ou:

```bash
vercel --prod
```
