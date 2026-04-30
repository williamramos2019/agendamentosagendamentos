import { Home, Briefcase, Sparkles, Crown, Building2, Car } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PlanAudience = "residencial" | "empresarial";

export interface SubscriptionPlan {
  id: string;
  audience: PlanAudience;
  name: string;
  tagline: string;
  price: number;          // valor mensal R$
  frequency: string;      // ex: "1 visita / mês"
  highlight?: boolean;    // plano "mais escolhido"
  icon: LucideIcon;
  features: string[];
  badge?: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  // ============ RESIDENCIAL ============
  {
    id: "res-essencial",
    audience: "residencial",
    name: "Essencial Lar",
    tagline: "O básico para manter sua casa sempre fresca",
    price: 149,
    frequency: "1 visita trimestral",
    icon: Home,
    features: [
      "Higienização de 1 sofá (até 3 lugares)",
      "1 colchão de casal por visita",
      "Agendamento prioritário",
      "10% off em serviços avulsos",
    ],
  },
  {
    id: "res-plus",
    audience: "residencial",
    name: "Conforto Plus",
    tagline: "Sua casa higienizada todo mês",
    price: 249,
    frequency: "1 visita mensal",
    highlight: true,
    badge: "Mais escolhido",
    icon: Sparkles,
    features: [
      "1 sofá + 2 colchões por visita",
      "2 tapetes (até 2m²) inclusos",
      "Impermeabilização com 20% off",
      "Atendimento em até 48h",
      "15% off em serviços extras",
    ],
  },
  {
    id: "res-premium",
    audience: "residencial",
    name: "Premium Família",
    tagline: "Cuidado completo para toda a família",
    price: 449,
    frequency: "2 visitas mensais",
    icon: Crown,
    features: [
      "Todos os estofados da casa",
      "Colchões + tapetes ilimitados",
      "Higienização de 1 automóvel/mês",
      "Impermeabilização inclusa 1x ao ano",
      "Atendimento em até 24h",
      "25% off em serviços extras",
    ],
  },
  // ============ EMPRESARIAL ============
  {
    id: "emp-office",
    audience: "empresarial",
    name: "Office Care",
    tagline: "Para escritórios e clínicas",
    price: 590,
    frequency: "1 visita mensal",
    icon: Briefcase,
    features: [
      "Até 10 cadeiras de escritório",
      "1 sofá de recepção",
      "Tapetes da área comum",
      "Emissão de nota fiscal",
      "Relatório fotográfico",
    ],
  },
  {
    id: "emp-corporate",
    audience: "empresarial",
    name: "Corporate Plus",
    tagline: "Hotéis, pousadas e empresas médias",
    price: 1290,
    frequency: "2 visitas mensais",
    highlight: true,
    badge: "Mais contratado",
    icon: Building2,
    features: [
      "Estofados ilimitados por visita",
      "Até 20 colchões / mês",
      "Impermeabilização inclusa",
      "Equipe dedicada",
      "SLA de 24h para emergências",
      "Faturamento mensal",
    ],
  },
  {
    id: "emp-frota",
    audience: "empresarial",
    name: "Frota Total",
    tagline: "Locadoras e frotas corporativas",
    price: 1890,
    frequency: "Sob demanda",
    icon: Car,
    features: [
      "Até 30 higienizações automotivas/mês",
      "Higienização interna completa",
      "Coleta e entrega no pátio",
      "Relatório individual por veículo",
      "Equipe exclusiva",
      "Contrato com SLA personalizado",
    ],
  },
];

export const COMPANY_WHATSAPP = "5531980252882";
