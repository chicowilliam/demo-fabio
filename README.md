# SuperMercado Guia de Compras (Demo)

Aplicação React para demonstrar um guia de compras por setores de supermercado, com foco em:

- Layout em grade robusto
- Experiência mobile forte e responsiva
- Segurança de rotas com autenticação de sessão local

## Rotas

- `/login`: acesso do usuário
- `/`: dashboard com setores e cards de planejamento
- `/setor/:sectorId`: detalhe de um setor específico

As rotas de dashboard e setor são protegidas por autenticação.

## Como rodar

1. Instale Node.js 18+
2. Instale dependências:
   - `npm install`
3. Rode em desenvolvimento:
   - `npm run dev`
4. Build de produção:
   - `npm run build`
5. Preview da build:
   - `npm run preview`

## Estrutura principal

- `src/context/AuthContext.jsx`: estado de autenticação
- `src/components/ProtectedRoute.jsx`: guarda de rotas
- `src/components/AppShell.jsx`: casca de layout principal
- `src/pages/DashboardPage.jsx`: grade de setores
- `src/pages/SectorPage.jsx`: detalhe por setor
- `src/pages/LoginPage.jsx`: login
