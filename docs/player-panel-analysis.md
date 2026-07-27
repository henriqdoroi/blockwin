# Análise da área autenticada do jogador — Etapa 1

Data da análise: 27 de julho de 2026  
Branch de trabalho: `feature/player-panel`

## 1. Resumo executivo

O repositório atual **não contém o projeto-fonte** da aplicação. Ele contém somente
um snapshot de artefatos de produção minificados, aparentemente baixado do domínio
de referência: dois documentos HTML, bundles JavaScript/CSS já compilados, ícones,
manifestos e uma imagem de fundo. Não existem `package.json`, lockfile, configuração
de build, arquivos TypeScript/JSX originais, servidor, schema de ORM, migrations,
testes ou configuração de implantação.

Também não existe a pasta solicitada `references/player-panel/` em nenhum ponto do
repositório ou do diretório `/workspace`. Portanto, não foi possível analisar o
conjunto de imagens mencionado pelo pedido. A única imagem de painel disponível é
`images/all/backgorund-painel1.png`, que foi inspecionada visualmente: ela apresenta
fundo azul com grade, brilho central, peças coloridas nas bordas e uma marca de
terceiro no centro. Essa imagem não deve ser reutilizada na implementação, pois o
pedido proíbe copiar logotipo e ativos da BlockWin.

Os bundles permitem inferir que o frontend original foi construído com React,
React Router, Zustand e Zod, mas não permitem recuperar de forma segura a arquitetura
do backend, o banco, o ORM, os modelos ou as garantias de segurança. Os endpoints
presentes no bundle apontam para um backend externo que não está neste repositório.
Implementar as etapas 2 a 11 sobre os arquivos minificados destruiria a
manutenibilidade e contrariaria a exigência de reutilizar a estrutura e o banco
existentes. Antes da Etapa 2, é necessário disponibilizar o código-fonte completo e
as referências visuais originais do projeto do contratante.

## 2. Inventário e estrutura de pastas

```text
blockwin/
├── README.md                         # contém somente o título do projeto
├── index.htm                         # shell HTML do bundle
├── painel.html                       # cópia do shell HTML para /painel
├── manifest.json                     # manifesto PWA baixado
├── manifest-1.json                   # duplicata do manifesto
├── favicon*.png                      # cópias/duplicatas de ícone
├── apple-touch-icon*.png             # cópias/duplicatas de ícone
├── webcopy-origin.txt                # registro da origem do download
├── assets/
│   ├── index-DkNC8JTO*.js            # aplicação React minificada (duplicada)
│   ├── vendor-CM6qdn1s*.js           # dependências minificadas (duplicadas)
│   ├── rolldown-runtime-Bh1tDfsg*.js # runtime do bundler (duplicado)
│   └── index-BG5atbmi*.css           # CSS compilado (duas variantes)
├── images/all/
│   └── backgorund-painel1.png        # único fundo de painel disponível
└── beacon.min.js/                    # cópia de script do Cloudflare
```

Não foram encontrados os diretórios normalmente esperados (`src`, `app`, `pages`,
`server`, `api`, `prisma`, `migrations`, `tests`, `public`) nem arquivos de
configuração de Node, TypeScript, Vite ou outro sistema de build.

## 3. Stack existente identificável

### 3.1 Frontend

Evidências nos artefatos compilados:

- **React**: runtime e mensagens oficiais do React no bundle `vendor`.
- **React Router**: rotas declarativas e mensagens do React Router no bundle.
- **Zustand**: o padrão de store compilado contém estado global de usuário, saldo,
  bootstrap e logout.
- **Zod**: validadores e mensagens de schema aparecem no bundle `vendor`.
- **Rolldown/Vite ou ferramenta compatível**: existe um bundle chamado
  `rolldown-runtime`, mas a configuração original de build não está presente.
- **CSS compilado global**: estilos minificados em um único arquivo, sem tokens ou
  fontes de componentes recuperáveis com segurança.
- **SPA**: `index.htm` e `painel.html` montam a aplicação em `#root` e carregam o
  mesmo JavaScript compilado.
- **PWA parcial**: há manifesto e metatags de standalone, mas os ícones apontados
  pelo manifesto (`/images/icons/...`) e um service worker não existem no snapshot.

Versões exatas não podem ser afirmadas porque não há manifesto de dependências.

### 3.2 Backend

O backend **não está presente**. O JavaScript compilado chama endpoints relativos
`/api/...`, o que indica que a versão publicada esperava um serviço no mesmo
origin. Não há código suficiente para identificar linguagem, framework, ORM,
filas, Redis, WebSocket ou mecanismo de migrations.

### 3.3 Banco de dados e ORM

Não identificáveis. Não há schema, migration, dump, client de ORM, variáveis de
ambiente ou dependência de acesso a dados no repositório. Consequentemente, também
não é possível confirmar:

- qual SGBD é utilizado;
- como transações atômicas são executadas;
- quais índices existem;
- se há ledger imutável;
- quais modelos e relacionamentos já existem;
- como dados financeiros são persistidos.

## 4. Rotas existentes

### 4.1 Rotas de interface inferidas do bundle

| Rota | Situação observável |
| --- | --- |
| `/` | página inicial da SPA |
| `/login` | login existente |
| `/cadastro` | cadastro existente |
| `/painel` | painel existente no bundle baixado |
| `/jogo` | rota existente no bundle |
| `/tutorial` | rota existente no bundle |
| `*` | fallback de rota |

A implementação futura deve preservar `/`, `/login` e `/cadastro`, concentrar toda
a experiência autenticada em `/painel` e avaliar a remoção **somente da navegação**
para `/jogo`, sem apagar comportamento existente antes de possuir o fonte.

### 4.2 Endpoints observáveis no frontend compilado

**Autenticação**

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

**Carteira e cupom**

- `GET /api/wallet/`
- `GET /api/wallet/deposit-info`
- `GET /api/wallet/withdraw-info`
- `POST /api/wallet/deposit`
- `POST /api/wallet/withdraw`
- `POST /api/wallet/withdraw-affiliate`
- `POST /api/cupons/resgatar`

**Jogo**

- `GET /api/game/config`
- `GET /api/game/active`
- `POST /api/game/start`
- `POST /api/game/:id/move`
- `POST /api/game/:id/cashout`
- `POST /api/game/forfeit`
- `GET /api/game/history`

**Usuário, indicação e configuração**

- `GET /api/public/config`
- `GET /api/users/referrals`
- `GET /api/indicacao/info`
- `POST /api/users/password` (método inferido pelo cliente compilado)
- `GET /api/users/level`
- `GET /api/users/stats`

Essas rotas são apenas contratos observados do cliente. Não foi validado que o
backend atual as implementa corretamente e elas não devem ser copiadas para uma
nova aplicação sem confirmar o contrato do projeto-fonte.

## 5. Autenticação e sessão

O cliente compilado revela o seguinte fluxo:

1. Todas as chamadas usam `fetch` com `credentials: "include"`, o que sugere
   autenticação por cookie.
2. O cliente adiciona `X-Requested-With: XMLHttpRequest`.
3. Em resposta `401` fora de `/api/auth/*`, uma única tentativa compartilhada de
   `POST /api/auth/refresh` é executada; em caso de sucesso, a requisição original
   é repetida.
4. O bootstrap chama `GET /api/auth/me` e grava `user` e `balanceCents` em uma store
   global Zustand.
5. O logout chama o backend e, independentemente do resultado, limpa usuário e
   saldo da store do navegador.

Não há token Bearer visível no bundle. Isso é compatível com cookies HttpOnly, mas
o atributo HttpOnly não pode ser comprovado pelo frontend. Também não é possível
confirmar `Secure`, `SameSite`, expiração, rotação do refresh token, armazenamento
server-side, invalidação de outras sessões, proteção CSRF ou rate limiting.

O bundle utiliza `localStorage` e `sessionStorage` para preferências e avisos de
interface. Não foi encontrada evidência de token sendo gravado nesses storages,
mas essa conclusão deve ser revisada no código-fonte.

## 6. Usuário autenticado e modelo de usuário

O usuário autenticado é recuperado por `GET /api/auth/me`. A resposta consumida
pelo frontend contém ao menos:

- `user`;
- `balanceCents`.

O formato completo de `user`, o nome da tabela, roles, status de conta, senha,
telefone, referral code e relacionamentos não podem ser determinados de maneira
confiável a partir do bundle. Não existe modelo `User` neste repositório.

O saldo aparece no estado global do cliente, porém não há evidência local de uma
carteira/ledger no servidor. Na implementação futura, a store deve ser somente uma
projeção dos valores autoritativos devolvidos pelo backend.

## 7. Componentes e comportamentos reutilizáveis

O bundle compilado contém evidências de componentes/comportamentos conceituais que
podem orientar a migração quando seus fontes forem fornecidos:

- store de sessão com `user`, `balanceCents`, bootstrap e logout;
- cliente HTTP central com normalização de erros e refresh de sessão;
- formatadores pt-BR para moeda e data;
- logotipo/cabeçalho;
- shell de rota protegida;
- componente de bottom sheet com handle, cabeçalho e botão fechar;
- fluxos de depósito e saque;
- consulta de configuração pública com cache de requisição;
- perfil/indicações;
- cliente de partida ativa, início, movimento, cashout e abandono.

Esses componentes **não são diretamente reutilizáveis em sua forma atual**, porque
estão minificados e não têm módulos-fonte nem testes. A reutilização correta exige
recuperar os arquivos originais do projeto, e não editar ou desminificar código de
terceiro.

## 8. Estilos, fontes e identidade visual

- Tema predominante observado: azul-marinho (`#0b0e1a`), superfícies escuras,
  verde/ciano para sucesso e ação, amarelo/dourado para recompensa, além de cores
  vivas das peças.
- O CSS usa uma variável `--font`, mas o snapshot não contém arquivos de fonte nem
  uma importação externa identificável; há fallbacks `monospace` em partes da UI.
- O HTML define `theme-color` como `#0b0e1a` e idioma `pt-BR`.
- O manifesto usa nome e textos da marca de referência, portanto deve ser
  substituído por configuração própria.
- O único background local contém logotipo e texto de terceiro e não poderá compor
  a nova interface.
- Os caminhos de vários ativos usados pelo bundle (`/images/logos/...`,
  `/images/banners/...`, `/images/icons/...`) não existem no repositório atual.

## 9. Referências visuais

### 9.1 Resultado da busca obrigatória

`references/player-panel/` não existe no checkout nem em `/workspace`; assim, o
número de imagens disponíveis nessa pasta é zero. Não há como declarar a análise
de “todas as imagens” concluída enquanto elas não forem adicionadas.

### 9.2 Único ativo visual disponível

`images/all/backgorund-painel1.png` foi aberto e inspecionado visualmente. Elementos
observados:

- canvas vertical para mobile;
- fundo azul em gradiente com grade geométrica;
- iluminação ciano na base;
- blocos 3D multicoloridos nas bordas inferiores;
- grande área negativa na metade superior;
- logotipo e assinatura da marca de referência no centro inferior.

A nova marca poderá preservar apenas ideias genéricas de composição (grade, área
negativa e iluminação), usando arte e logotipo originais.

### 9.3 Site indicado

Foi tentada uma leitura não invasiva do endereço informado. O acesso automatizado
retornou HTTP 401 e não foi usado para executar operações autenticadas. As
credenciais fornecidas pelo solicitante não foram persistidas, adicionadas a
arquivos, registradas em comandos ou usadas para movimentações financeiras.

## 10. Painel administrativo e integrações financeiras

### Painel administrativo

Nenhuma rota `/admin`, componente administrativo, autorização por role ou código de
auditoria foi encontrado no snapshot. Isso não prova que o ambiente remoto não
tenha administração; prova apenas que ela não foi entregue neste repositório.

### Integração financeira

O frontend conhece fluxos de depósito, saque, saque de afiliado e cupom. Não existe
SDK de provedor, webhook, assinatura, conciliação, ledger ou implementação de PIX no
checkout. Por isso:

- não é possível identificar provedor financeiro;
- não é possível confirmar se o ambiente atual é sandbox ou produção;
- não é possível auditar aprovação server-side;
- não é seguro disparar os endpoints remotos durante a análise;
- a Etapa 2 deverá iniciar estritamente com `PLATFORM_MODE=sandbox`.

## 11. Arquivos alterados nesta etapa

- `docs/player-panel-analysis.md` — relatório arquitetural, riscos e plano.

Nenhum arquivo de aplicação, HTML, CSS, JavaScript, imagem ou manifesto foi
alterado na Etapa 1.

## 12. Arquivos previstos para alteração

A lista exata depende da entrega do fonte. Com base no contrato solicitado, os
prováveis pontos de alteração são:

- configuração de ambiente e validação de variáveis;
- modelo `User` existente (somente relações, role/status e referral code quando
  estritamente necessário);
- configuração do ORM e migrations;
- router da aplicação para proteger `/painel`;
- store/cliente de sessão existente;
- handlers de login/cadastro somente para redirecionamento pós-autenticação;
- manifesto, metadados PWA e registro de service worker;
- configuração de testes, lint, typecheck e build;
- configuração de headers, cookies, CSRF e rate limits.

Não é apropriado nomear caminhos concretos inexistentes antes de conhecer o layout
real do código-fonte.

## 13. Arquivos e módulos previstos para criação

Estrutura alvo conceitual, a ser adaptada ao framework real sem migrá-lo:

```text
docs/
├── player-panel-analysis.md
├── player-panel-assets.md
└── player-panel-security.md

public/brand/
├── logo.png
├── icon.png
├── favicon.ico
├── game-banner.webp
├── deposit-banner.webp
├── withdraw-banner.webp
└── referral-banner.webp

player-panel/
├── config/brand-and-platform-config
├── components/
│   ├── PlayerPanel
│   ├── InstallAppBar
│   ├── PanelHeader
│   ├── GameLobbyCard
│   ├── BottomNavigation
│   ├── BottomSheet
│   ├── SheetManager
│   └── sheets/*
├── game-engine/
│   ├── board
│   ├── pieces
│   ├── rng
│   ├── moves
│   ├── scoring
│   ├── replay
│   └── validation
├── server/
│   ├── wallet-and-ledger
│   ├── sandbox-payment-provider
│   ├── deposits-and-coupons
│   ├── withdrawals
│   ├── referrals-and-commissions
│   ├── games-and-settlement
│   └── profile-and-preferences
└── tests/
    ├── unit
    ├── integration
    └── e2e
```

Também serão necessárias migrations seguras para os modelos especificados no
pedido, após mapear o schema real e as convenções do ORM.

## 14. Riscos de quebra e segurança

| Risco | Gravidade | Mitigação |
| --- | --- | --- |
| Ausência do código-fonte | Bloqueante | obter repositório-fonte antes da Etapa 2 |
| Ausência de backend/ORM/migrations | Bloqueante | entregar serviço e schema reais; não inventar migração incompatível |
| Referências visuais ausentes | Alta | adicionar `references/player-panel/` e inventariar cada imagem |
| Snapshot contém material da marca de referência | Alta | remover/substituir somente durante implementação com ativos próprios |
| Endpoints remotos podem movimentar valores | Crítica | não chamar rotas financeiras; implementar sandbox isolado |
| Contrato de sessão incompleto | Crítica | auditar cookies, refresh, CSRF, revogação e rate limiting no servidor |
| Saldo somente observável no frontend | Crítica | criar carteira e ledger transacionais no backend |
| Jogo financeiro sem validador server-side disponível | Crítica | motor compartilhado, replay determinístico e liquidação idempotente |
| Bundles duplicados e HTML divergente | Média | reconstruir pelo pipeline fonte, nunca editar bundles à mão |
| Manifesto aponta para ícones inexistentes | Média | gerar conjunto PWA próprio e validar instalação |
| Não há suíte de testes/build | Alta | restaurar toolchain e estabelecer baseline antes de funcionalidade |
| Possível impacto regulatório de jogo com dinheiro | Alta | revisão jurídica e de compliance antes de produção; sandbox por padrão |

## 15. Plano de implementação por etapas

### Pré-condição para continuar

1. Disponibilizar o repositório-fonte completo do frontend e backend.
2. Adicionar todas as imagens em `references/player-panel/`.
3. Fornecer ativos e nome da marca própria ou autorizar criação de placeholders
   originais.
4. Disponibilizar um banco de desenvolvimento vazio ou anonimizado e documentar o
   processo de migration.
5. Definir `PLATFORM_MODE=sandbox` e impedir inicialização insegura sem essa
   variável em ambientes de desenvolvimento/teste.

### Etapa 2 — dados, carteira e APIs base

- Mapear o schema real e criar migrations aditivas/reversíveis.
- Reutilizar `User`; criar Wallet e ledger com constraints contra saldo negativo,
  idempotência e referências únicas.
- Criar configuração central de marca/plataforma, game tiers e score config.
- Criar bootstrap autenticado agregado e presença por heartbeat real.
- Cobrir transações, autorização e concorrência com testes de integração.

### Etapa 3 — shell autenticado

- Proteger `/painel` no servidor e no router.
- Criar `PlayerPanel`, barra PWA, cabeçalho, lobby, menu fixo e `BottomSheet`.
- Implementar focus trap, Escape, backdrop, history/back, restauração de foco,
  gesto pointer e reduced motion.
- Manter a página montada e centralizar o estado dos sheets.

### Etapa 4 — depósito sandbox e cupom

- Implementar `PaymentProvider` e `SandboxPaymentProvider` exclusivamente no
  servidor.
- Criar cobrança fictícia, QR próprio, expiração e aprovação simulada permitida
  apenas em desenvolvimento.
- Validar cupons, aplicar limites em transação e creditar ledger de forma
  idempotente.

### Etapa 5 — saque sandbox

- Validar CPF, chave, limites, status, saldo e idempotency key.
- Reservar saldo atomicamente; implementar aprovação/recusa administrativas em
  sandbox e devolução por ledger.

### Etapa 6 — indicações e comissões

- Gerar referral codes criptograficamente aleatórios.
- Materializar/consultar até quatro níveis sem recursão aberta, impedindo ciclos e
  dupla atribuição.
- Gerar comissões somente após evento confirmado e protegê-las por unicidade da
  origem/beneficiário/nível.

### Etapa 7 — perfil

- Agregar estatísticas no backend; paginar transações e jogos.
- Implementar troca de senha com hash seguro, rate limiting e revogação opcional
  das demais sessões.
- Garantir logout server-side e redirecionamento para login.

### Etapa 8 — motor determinístico

- Criar catálogo original por coordenadas, PRNG versionado e estado serializável.
- Isolar validação, placement, limpeza simultânea, score, combo, detecção de
  movimentos, game over e replay.
- Cobrir todos os casos unitários solicitados, inclusive adulteração.

### Etapa 9 — integração e liquidação

- Criar sessão com seed/nonce/config version server-side.
- Aceitar somente movimentos sequenciais idempotentes.
- Reproduzir replay no backend; nunca aceitar score/resultado/recompensa do cliente.
- Liquidar vitória/derrota atomicamente e abrir o resultado após validação.

### Etapa 10 — administração mínima

- Criar área isolada protegida por role `ADMIN`.
- Gerenciar configurações e operações sandbox autorizadas.
- Registrar toda ação sensível em `AdminAuditLog`, com estado anterior/posterior.

### Etapa 11 — qualidade final

- Executar unitários, integração e E2E em desktop/mobile.
- Auditar acessibilidade, responsividade, console, offline/PWA e segurança.
- Executar lint, typecheck e build de produção.
- Testar concorrência, idempotência, replay, saldo negativo e dupla liquidação.

## 16. Critério de saída da Etapa 1

Concluído nesta etapa:

- branch criada antes de alterações em arquivos;
- checkout e histórico inspecionados;
- framework frontend inferido;
- fluxo de login, bootstrap, refresh e logout documentado;
- rotas de UI e endpoints presentes no bundle inventariados;
- presença/ausência de banco, ORM, User, admin e financeiro registrada;
- todos os ativos visuais disponíveis inspecionados;
- riscos e plano incremental documentados.

Pendências reais e bloqueantes:

- pasta `references/player-panel/` ausente;
- código-fonte frontend ausente;
- backend, banco, ORM e migrations ausentes;
- toolchain de lint, typecheck, testes e build ausente;
- ativos próprios da marca ainda não fornecidos.

Nenhuma migration, endpoint, componente ou funcionalidade foi criada nesta etapa,
em conformidade com a ordem solicitada.

## 17. Adendo — referências recebidas após a Etapa 1

Após a conclusão da análise inicial, foram fornecidas sete capturas de tela no
pedido de implementação. Elas mostram: lobby central, sheet de depósito, sheet de
saque, sheet alto de indicação em duas posições de rolagem e perfil fechado/aberto
nos acordeões. A implementação visual subsequente adotou a composição responsiva,
hierarquia, densidade, navegação fixa, backdrop desfocado e comportamento de sheets
dessas referências, mas criou marca, textos, ilustrações em CSS e cores próprias.

Como as capturas foram anexadas à conversa e não adicionadas ao checkout, elas não
se tornaram arquivos versionados em `references/player-panel/`.
