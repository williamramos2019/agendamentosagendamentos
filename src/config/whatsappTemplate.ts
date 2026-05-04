/**
 * Template do orçamento enviado via WhatsApp.
 *
 * Edite aqui livremente — basta manter os placeholders entre {chaves}.
 * Linhas vazias são preservadas. Linhas que ficarem só com placeholder vazio
 * (ex.: distância ou foto) são removidas automaticamente.
 *
 * Placeholders disponíveis:
 *   {empresaNome}      — nome da empresa
 *   {empresaSlogan}    — slogan / descrição curta
 *   {empresaRegiao}    — área de atendimento
 *   {empresaTelefone}  — telefone exibido
 *   {empresaSite}      — URL do site
 *   {clienteNome}      — nome do cliente
 *   {clienteTelefone}  — WhatsApp do cliente
 *   {clienteEndereco}  — endereço informado
 *   {distancia}        — “📏 *Distância:* X km” (vazio se não houver)
 *   {servicoNome}      — nome do serviço
 *   {opcaoLabel}       — opção/detalhe escolhido
 *   {dataExtenso}      — data por extenso (segunda-feira, 05 de maio)
 *   {hora}             — horário (HH:mm)
 *   {duracao}          — duração estimada em minutos
 *   {valor}            — valor formatado em BRL
 *   {observacaoFoto}   — aviso sobre foto enviada (vazio se não houver)
 */

export const COMPANY_INFO = {
  nome: "AUTO LIMPEZA PRO",
  slogan: "Higienização de Estofados • Estética Automotiva • Pós-Obra",
  regiao: "São José da Lapa, Vespasiano e região",
  telefone: "(31) 98025-2882",
  whatsapp: "5531980252882",
};

export const WHATSAPP_BUDGET_TEMPLATE = `🧽 *{empresaNome}*
_{empresaSlogan}_
📍 {empresaRegiao}
📞 {empresaTelefone}
🌐 {empresaSite}
━━━━━━━━━━━━━━━━━━

*🧾 NOVO ORÇAMENTO*

👤 *Cliente:* {clienteNome}
📱 *WhatsApp:* {clienteTelefone}
📍 *Endereço:* {clienteEndereco}
{distancia}

🧼 *Serviço:* {servicoNome}
🔧 *Opção:* {opcaoLabel}
📅 *Data:* {dataExtenso} às {hora}
⏱️ *Duração estimada:* {duracao} min

💰 *Valor estimado:* {valor}
_(valor pode variar conforme avaliação no local — pagamento após o serviço)_

{observacaoFoto}

━━━━━━━━━━━━━━━━━━
✅ Atendimento profissional
✅ Produtos antialérgicos
✅ Equipe treinada e uniformizada

Confirma para mim, por favor? 🙌`;

export type WhatsAppTemplateVars = {
  empresaNome: string;
  empresaSlogan: string;
  empresaRegiao: string;
  empresaTelefone: string;
  empresaSite: string;
  clienteNome: string;
  clienteTelefone: string;
  clienteEndereco: string;
  distancia: string;
  servicoNome: string;
  opcaoLabel: string;
  dataExtenso: string;
  hora: string;
  duracao: string | number;
  valor: string;
  observacaoFoto: string;
};

/**
 * Substitui os placeholders e remove linhas que ficaram vazias após
 * a interpolação (útil para campos opcionais como distância / foto).
 */
export function renderWhatsAppTemplate(
  template: string,
  vars: WhatsAppTemplateVars,
): string {
  const replaced = template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = (vars as Record<string, unknown>)[key];
    return value === undefined || value === null ? "" : String(value);
  });

  // Remove linhas que sobraram totalmente vazias por placeholders ausentes,
  // mas preserva separações intencionais (linhas em branco no template original).
  return replaced
    .split("\n")
    .filter((line, idx, arr) => {
      if (line.trim() !== "") return true;
      // mantém apenas a primeira linha em branco de cada bloco
      return arr[idx - 1]?.trim() !== "";
    })
    .join("\n");
}
