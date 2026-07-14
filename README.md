# Contax

**Contax** é um webapp moderno para controle de contas mensais, criado para substituir planilhas de Excel. Oferece uma experiência rápida, elegante e intuitiva para organizar despesas, acompanhar pagamentos e gerenciar recorrências.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest-000?logo=shadcnui)
![Tauri](https://img.shields.io/badge/Tauri-2-FFC131?logo=tauri)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Funcionalidades

### Dashboard
- **Cards de resumo** — Total do mês, total pago, pendente, vencido, próximo vencimento e quantidade de contas
- **Gráfico de pizza** — Distribuição de despesas por categoria
- **Gráfico de barras** — Comparação entre contas pagas e pendentes
- **Próximos vencimentos** — Lista das 5 contas mais urgentes

### Gerenciamento de Contas
- **Modal de cadastro/edição** — Formulário completo com nome, categoria, valor, vencimento, status, observações e recorrência
- **Ações rápidas** — Ao clicar em uma conta: editar, marcar como pago/reverter, duplicar ou excluir
- **Organização por categorias** — Acordeões expansíveis com subtotal por categoria
- **Seleção múltipla** — Marque várias contas e marque como pagas de uma vez

### Recorrência
- Contas marcadas como **recorrentes** são automaticamente recriadas no mês seguinte
- Mantém nome, valor e categoria; altera apenas a competência

### Calendário
- Visualização mensal com indicadores de status por dia
- Ao clicar em um dia, exibe a lista de contas daquela data

### Filtros e Busca
- Filtros por **mês**, **ano**, **categoria**, **status** e **recorrência**
- **Pesquisa por nome** em tempo real
- Navegação rápida entre meses com setas no cabeçalho

### Categorias
- Gerenciamento completo (criar, editar, excluir)
- Categorias padrão: Casa, Empresa, Cartões de Crédito, Assinaturas, Veículos, Impostos, Saúde, Lazer, Outros

### Utilitários
- **Duplicar conta** individualmente
- **Duplicar mês inteiro** para o próximo período
- Salvamento automático no **localStorage**

---

## Stack

| Tecnologia | Versão |
|-----------|--------|
| [Next.js](https://nextjs.org) | 16 |
| [React](https://react.dev) | 19 |
| [TypeScript](https://typescriptlang.org) | 5 |
| [TailwindCSS](https://tailwindcss.com) | 4 |
| [shadcn/ui](https://ui.shadcn.com) | latest |
| [Zustand](https://zustand-demo.pmnd.rs) | 5 |
| [Framer Motion](https://motion.dev) | latest |
| [Recharts](https://recharts.org) | 2 |
| [Lucide Icons](https://lucide.dev) | latest |
| [Tauri](https://tauri.app) | 2 |

---

## Começando

### Web

```bash
npm install
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173) no navegador.

### Desktop (Tauri)

> Requer **Rust** instalado ([rustup.rs](https://rustup.rs))

```bash
npm install
npx tauri dev      # Rodar em modo desenvolvimento
npx tauri build     # Gerar instalador .exe/.msi
```

O instalador será gerado em `src-tauri/target/release/bundle/nsis/`.

---

## Estrutura do Projeto

```
src/
├── app/                   # Páginas Next.js App Router
├── components/            # Componentes React
├── lib/                   # Utilitários
├── store/                 # Estado global (Zustand)
└── types/                 # Tipos TypeScript
src-tauri/                 # Bundler desktop (Tauri)
├── src/                   # Código Rust
├── icons/                 # Ícones do aplicativo
├── tauri.conf.json        # Configuração Tauri
└── Cargo.toml             # Dependências Rust
```

---

## Licença

MIT
