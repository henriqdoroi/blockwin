# Instruções permanentes do projeto

## Objetivo

Este projeto já possui página inicial, login e cadastro.

Preservar essas partes e implementar:

- Painel autenticado do jogador.
- Jogo próprio de blocos 8x8.
- Backend autoritativo de partidas.
- Carteira e ledger.
- Depósito sandbox.
- Saque sandbox.
- Indicação multinível.
- Perfil e históricos.
- Painel administrativo mínimo.

## Regras de trabalho

1. Antes de alterar código, analisar a stack e a arquitetura existente.
2. Não migrar o projeto para outro framework sem necessidade.
3. Não apagar ou reescrever login, cadastro ou landing page.
4. Não copiar código, imagens, textos, sons ou ativos de terceiros.
5. Usar as referências somente para compreender comportamento e organização.
6. Toda mudança no banco deve usar migrations.
7. Não executar comandos destrutivos.
8. Não alterar saldo diretamente sem criar uma transação no ledger.
9. O navegador nunca pode decidir pontuação, prêmio ou resultado oficial.
10. O backend é a autoridade da partida.
11. Toda operação financeira deve iniciar em modo sandbox.
12. Não criar PIX ou saque real.
13. Não deixar TODOs ou botões sem funcionamento.
14. Não usar mocks silenciosos.
15. Depois de cada etapa, executar lint, typecheck, testes e build.
16. Corrigir os erros antes de prosseguir.
17. Trabalhar em commits pequenos e separados por etapa.

## Modo financeiro

Usar:

`PLATFORM_MODE=sandbox`

No sandbox:

- Créditos sem valor financeiro.
- PIX fictício.
- Saques simulados.
- Aprovações somente pelo backend.
- Avisos claros de demonstração.

## Comandos de validação

Identificar os comandos reais do projeto e documentá-los.

Executar sempre que aplicável:

- lint
- typecheck
- testes unitários
- testes de integração
- testes end-to-end
- build de produção
