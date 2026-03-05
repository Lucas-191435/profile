# Profile App

Uma aplicação web completa desenvolvida com Next.js que combina sistema de autenticação robusto com funcionalidades interativas de Pokémon, oferecendo diferentes experiências baseadas em roles de usuário.

## 🚀 Funcionalidades

### Autenticação e Autorização
- **Sistema de Login/Logout** com NextAuth.js
- **Recuperação de Senha** e redefinição
- **Criação de Contas** para novos usuários
- **Sistema de Roles** com diferentes níveis de acesso:
  - **Client** - Usuários padrão
  - **Consultant** - Consultores/Coaches
  - **Master Coach** - Coaches mestres
  - **Franchise** - Franqueados
  - **Admin** - Administradores

### Área do Cliente
- **Dashboard Principal** com overview das funcionalidades
- **Meus Pokémon** - Gerenciamento de coleção pessoal
- **Regiões** - Exploração de diferentes áreas
- **Itens** - Inventário de itens do usuário
- **Perfil** - Configurações da conta

### Área Administrativa
- **Painel Admin** com controles avançados
- **Gerenciamento de Usuários** e permissões

### Componentes e UI
- **Design System** customizado com Shadcn/UI
- **Interface Responsiva** com Tailwind CSS
- **Componentes Reutilizáveis** (formulários, botões, inputs)
- **Máscaras de Input** personalizadas (CPF/CNPJ, telefone, moeda)

## 🛠️ Tecnologias

### Frontend
- **[Next.js 16.1.6](https://nextjs.org/)** - Framework React com App Router
- **[React 19.2.3](https://reactjs.org/)** - Biblioteca de interface
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS
- **[Shadcn/UI](https://ui.shadcn.com/)** - Componentes de interface

### Autenticação
- **[NextAuth.js](https://next-auth.js.org/)** - Autenticação completa
- **[JSON Web Tokens](https://jwt.io/)** - Gerenciamento de sessões

### Gerenciamento de Estado
- **[TanStack Query](https://tanstack.com/query)** - Cache e sincronização de dados
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[Yup](https://github.com/jquense/yup)** + **[Zod](https://zod.dev/)** - Validação de schemas

### Comunicação
- **[Axios](https://axios-http.com/)** - Cliente HTTP
- **[Sonner](https://sonner.emilkowal.ski/)** - Notificações toast

### Desenvolvimento
- **[ESLint](https://eslint.org/)** - Linting de código
- **[TanStack Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)** - Debug de queries

## 🏗️ Estrutura do Projeto

```
src/
├── app/                      # App Router do Next.js
│   ├── (auth)/              # Rotas de autenticação
│   │   ├── login/           # Página de login
│   │   ├── create/          # Criação de conta
│   │   ├── forgot-password/ # Recuperação de senha
│   │   └── reset-password/  # Redefinição de senha
│   ├── (private-routes)/    # Rotas protegidas
│   │   ├── admin/           # Área administrativa
│   │   └── client/          # Área do cliente
│   │       ├── (home)/      # Dashboard principal
│   │       ├── itens/       # Gerenciamento de itens
│   │       ├── my-pokemon/  # Coleção de Pokémon
│   │       ├── profile/     # Perfil do usuário
│   │       └── regions/     # Regiões disponíveis
│   └── api/                 # API routes
│       └── auth/            # Endpoints de autenticação
├── components/              # Componentes reutilizáveis
│   ├── ui/                  # Componentes base (Shadcn)
│   ├── inputs/              # Inputs customizados
│   ├── layout/              # Componentes de layout
│   └── shared/              # Componentes compartilhados
├── hooks/                   # Custom hooks
├── lib/                     # Utilitários e configurações
├── services/                # Serviços de API
│   ├── queries/             # React Query hooks
│   └── dto/                 # Data Transfer Objects
├── types/                   # Definições TypeScript
├── utils/                   # Funções utilitárias
└── validations/             # Schemas de validação
```

## 🚦 Começando

### Pré-requisitos

- Node.js 18+ 
- npm, yarn, pnpm ou bun

### Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd profile
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env.local na raiz do projeto
cp .env.example .env.local
```

Adicione as seguintes variáveis:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
baseUrl=http://localhost:3001/api
```

4. **Execute o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

5. **Abra [http://localhost:3000](http://localhost:3000)** no seu navegador

## 📁 Scripts Disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Gera build de produção
npm run start    # Inicia servidor de produção
npm run lint     # Executa linting do código
```

## 🔐 Sistema de Autenticação

O sistema de autenticação utiliza NextAuth.js com provider de credenciais custom:

- **Login**: Autenticação via email e senha
- **Logout**: Limpeza de sessão segura
- **Recuperação**: Sistema de reset de senha
- **Proteção de Rotas**: Middleware para rotas privadas
- **Gerenciamento de Roles**: Controle de acesso baseado em função

## 🎮 Funcionalidades Pokémon

A aplicação integra funcionalidades relacionadas a Pokémon:

- **Coleção Pessoal**: Gerencie seus Pokémon capturados
- **Sistema de Levels**: Acompanhe experiência e estatísticas
- **Regiões**: Explore diferentes áreas do mundo Pokémon
- **Inventário**: Organize itens e recursos

## 🎨 Design System

A aplicação utiliza um design system consistente baseado em:

- **Componentes Shadcn/UI**: Componentes acessíveis e customizáveis
- **Tailwind CSS**: Abordagem utility-first para estilização
- **Design Responsivo**: Otimizado para desktop e mobile
- **Tema Consistente**: Paleta de cores e tipografia unificada

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

## 📞 Contato

- 📧 Email: [seu-email@exemplo.com]
- 💼 LinkedIn: [Seu Perfil LinkedIn]
- 🐙 GitHub: [Seu GitHub]

---

**Desenvolvido com ❤️ usando Next.js e TypeScript**
