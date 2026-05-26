# Documentação Técnica - Auto Limpeza Pro

## 🚀 1. Arquitetura Geral
O sistema é uma **SPA (Single Page Application)** moderna desenvolvida com:
- **Frontend**: React 18 + Vite (Rápido e otimizado).
- **Estilização**: Tailwind CSS (Design responsivo e utilitário).
- **Backend**: API PHP estruturada (Simples e compatível com qualquer hospedagem).
- **Gerenciamento de Estado**: TanStack Query (React Query) para sincronização de dados.

## 📂 2. Estrutura do Projeto (Frontend)
- `src/components`: Componentes modulares (Hero, Formulários, Cards).
- `src/pages`: Definição das rotas e visões (Home, Agendamento, Sucesso).
- `src/services`: Camada de abstração para chamadas de API (`api.ts`) e Notificações.
- `src/hooks`: Lógica compartilhada, como o `use-mobile` para responsividade.
- `public`: Ativos estáticos e o arquivo `.htaccess` para suporte a rotas na HostGator.

## 🔄 3. Fluxo de Agendamento
1. **Interface**: O usuário preenche o formulário em `/agendar`.
2. **Validação**: O frontend valida os campos e envia via `POST` para `api/api.php?action=create_appointment`.
3. **Persistência**: O PHP salva no banco de dados e retorna um token de acesso único.
4. **Confirmação**: O usuário é redirecionado para uma página de sucesso, onde pode visualizar os detalhes sem precisar de login.

## 🔔 4. Notificações e Lembretes
- **Web Push**: Implementado via Service Workers para alertas em tempo real.
- **Lembretes Automáticos**: O sistema verifica a data do agendamento e dispara notificações locais 1 dia antes.
- **Sem Cron**: A lógica de verificação é disparada durante a navegação do usuário, eliminando a necessidade de tarefas agendadas no servidor.

## 🛠️ 5. Processo de Build e Deploy
Para gerar a versão de produção:
1. Execute `npm run build`.
2. A pasta `dist` será criada com todos os arquivos otimizados.
3. Suba o conteúdo da `dist` para a raiz (public_html) da sua hospedagem.
4. Certifique-se de que a pasta `/api` com os arquivos PHP também esteja presente.

---
*Documentação gerada automaticamente para o projeto Auto Limpeza Pro.*
