# Contax

**Contax** é um webapp moderno para controle de contas mensais, criado para substituir planilhas de Excel. Oferece uma experiência rápida, elegante e intuitiva para organizar despesas, acompanhar pagamentos e gerenciar recorrências.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest-000?logo=shadcnui)
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

---

## Começando

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/contax.git
cd contax

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173) no navegador.

### Build de produção

```bash
npm run build
npm start
```

---

## Estrutura do Projeto

```
src/
├── app/                   # Páginas Next.js App Router
│   ├── globals.css        # Estilos globais e tema
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página principal
├── components/
│   ├── calendar/          # Visualização em calendário
│   ├── dashboard/         # Cards, gráficos, próximos vencimentos
│   ├── expenses/          # CRUD de contas, ações, categorias
│   ├── filters/           # Barra de filtros
│   └── ui/                # Componentes shadcn/ui
├── lib/
│   └── utils.ts           # Utilitários (formatação, cores)
├── store/
│   └── useStore.ts        # Estado global (Zustand + persist)
└── types/
    └── index.ts           # Tipos TypeScript
```

---

## Licença

MIT
