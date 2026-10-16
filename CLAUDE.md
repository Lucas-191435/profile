# profile (web-pokedex)

Front do projeto Pokémon: Pokédex, "Meus Pokémon", itens, chat e batalha em tempo real. Consome a API em `../poke-api-nest` (NestJS, porta 3333).

Stack: Next.js 16 (App Router) + React 19, Tailwind CSS **v4**, shadcn/ui (new-york) sobre Radix, TanStack Query 5, NextAuth 4, Socket.io client, React Hook Form + Zod/Yup. Gerenciador: **npm**.

## Comandos

```bash
npm run dev      # dev server
npm run build    # build de produção (usar para checar erros de tipo)
npm run lint
```

Não há testes automatizados no front. Para validar, rode `npm run build` + `npm run lint` e teste na tela.

## Estrutura

- `src/app/(auth)/` — login, cadastro, esqueci/redefinir senha (públicas).
- `src/app/(private-routes)/` — `client/`, `admin/`, `battle/[id]/`... Protegidas no `layout.tsx` via `getServerSession` + `redirect("/login")`.
- Padrão de página: `page.tsx` fino (só monta/Suspense) que renderiza `ui/index.tsx` (client component com a tela). Componentes específicos da rota ficam em `components/` ao lado.
- `src/services/api.ts` — HttpService Axios (injeta Bearer token). Chamadas retornam `{ request }`: use `await api.get(url).request`.
- `src/services/queries/use*.ts` — **todo acesso à API passa por hooks React Query aqui**, com `errorToast` no `onError`. Não chame `api` direto dos componentes.
- `src/context/` — estado compartilhado (`BattleContext` controla a partida via socket; `SoundContext`/`BattleSoundContext` com Howler).
- `src/lib/socket.ts` — sockets `/chat` e `/battle`.
- `src/types/I*.ts` — tipos espelhando os DTOs da API.
- `src/components/ui/` — componentes shadcn (adicionar com `npx shadcn@latest add <comp>`).
- `docs/` — planos de features (local, fora do git).

## Regras

- **Tailwind v4**: não existe `tailwind.config` efetivo — tema e utilitários customizados ficam em `src/app/globals.css` (`@theme`, `@layer`). Botões já recebem `cursor: pointer` globalmente.
- Use componentes shadcn/Radix para modais, popovers, selects etc. (já trazem foco, Esc e ARIA). Não crie modal "na mão".
- Use `cn()` de `@/lib/utils` para compor classes.
- Usuário com role `TEST` é somente leitura: use `useIsTestUser()` para desabilitar controles de escrita (o backend devolveria 403).
- Animações devem respeitar `motion-reduce:` (ver `BattleSpotlight.tsx`). Imagens de Pokémon com `alt` descritivo.
- Textos da interface em **português (pt-BR)**.
- Variáveis de ambiente chegam via `next.config.ts` (`process.env.baseUrl`, `process.env.mode`). Nunca leia nem comite `.env*`.
- Mudança que depende de contrato novo da API (endpoint, evento de socket, campo de DTO) → confira o lado do `../poke-api-nest`.
- Commits no padrão Conventional Commits em português: `feat(battle): ...`, `fix: ...`.
