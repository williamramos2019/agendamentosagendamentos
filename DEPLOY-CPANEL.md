# 🚀 Deploy no cPanel — CleanPro Agenda Smart

App **100% estático** (React + localStorage). Não precisa de Node, PHP, banco, nem nada no servidor.

---

## ✅ Passo 1 — Gerar o build de produção

No seu computador (com Node instalado), na pasta do projeto:

```bash
npm install
npm run build
```

Isso cria a pasta **`dist/`** com todos os arquivos prontos.

> 💡 Não tem Node no PC? Use a opção **"Download ZIP"** do GitHub conectado e gere o build em qualquer máquina com Node, ou peça pra alguém gerar pra você.

---

## ✅ Passo 2 — Subir pro cPanel

### Opção A — Via Gerenciador de Arquivos (mais fácil)

1. Abra o cPanel → **Gerenciador de Arquivos**.
2. Entre em **`public_html/`** (ou subpasta tipo `public_html/agenda/` se quiser em `seusite.com/agenda`).
3. **Apague o `index.html` padrão** que vier do cPanel.
4. Compacte a pasta **`dist/`** num `.zip` no seu PC.
5. Clique em **Upload** no cPanel → envie o `.zip`.
6. Volte ao Gerenciador → clique no `.zip` → **Extract** (extrair na mesma pasta).
7. **Importante:** os arquivos devem ficar **diretamente dentro** de `public_html/`, não dentro de `public_html/dist/`. Se ficar, mova-os pra fora.
8. Confirme que o **`.htaccess`** foi extraído (ative "Mostrar arquivos ocultos" no Gerenciador).

### Opção B — Via FTP (FileZilla)

1. Conecte com as credenciais FTP do cPanel.
2. Arraste **todo o conteúdo** da pasta `dist/` (não a pasta inteira, só o conteúdo) pra `public_html/`.

---

## ✅ Passo 3 — Testar

Acesse `https://seusite.com.br` → deve carregar o app.

Teste também:
- Atualizar a página em qualquer tela (F5) → não pode dar 404.
- Navegar pelo agendamento → deve fluir normalmente.

---

## 🔧 Configurações já incluídas

O projeto já vem pronto com:

- ✅ **`vite.config.ts`** com `base: "./"` → funciona em raiz **ou** subpasta.
- ✅ **`public/.htaccess`** com:
  - SPA fallback (rotas/refresh funcionam)
  - Compressão Gzip
  - Cache de assets (1 ano)
  - Headers de segurança
  - MIME types corretos

---

## 📁 Instalando em subpasta (ex: `seusite.com/agenda`)

1. Crie a pasta `agenda/` dentro de `public_html/`.
2. Suba o conteúdo do `dist/` pra dentro dela.
3. Edite o `.htaccess` da subpasta e descomente:
   ```apache
   RewriteBase /agenda/
   ```

---

## ❓ Problemas comuns

| Problema | Solução |
|---|---|
| Tela branca | Abra DevTools (F12) → veja erros 404 nos assets. Geralmente é caminho errado. Confirme `base: "./"` no `vite.config.ts`. |
| Refresh dá 404 | `.htaccess` não foi enviado. Ative "mostrar ocultos" no FTP/Gerenciador. |
| `.htaccess` não funciona | Hospedagem desabilitou `mod_rewrite`. Contate o suporte do cPanel. |
| Mudei algo e não aparece | Limpe cache do navegador (Ctrl+Shift+R). O HTML não é cacheado, mas o navegador pode segurar. |

---

## 🔄 Atualizar o app depois

1. Rode `npm run build` de novo no PC.
2. No cPanel, apague o conteúdo antigo de `public_html/` (mantenha o `.htaccess` se quiser).
3. Suba o novo `dist/`.

Pronto. Sem Node, sem dor de cabeça. 🎉
