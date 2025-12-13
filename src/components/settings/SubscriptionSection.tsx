import { Crown, Check, Calendar, CreditCard, History, ChevronRight, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Subscription, PaymentHistory } from "@/hooks/useProfileSettings";

interface SubscriptionSectionProps {
  subscription: Subscription;
  paymentHistory: PaymentHistory[];
}

const plans = [
  {
    name: 'Básico',
    price: 49.90,
    features: ['1 funcionário', 'Agenda básica', 'Relatórios simples', 'Suporte por e-mail'],
  },
  {
    name: 'Pro',
    price: 99.90,
    features: ['Até 5 funcionários', 'Relatórios avançados', 'Agenda ilimitada', 'Suporte prioritário'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 199.90,
    features: ['Funcionários ilimitados', 'API de integração', 'Multi-unidades', 'Gerente dedicado'],
  },
];

export function SubscriptionSection({ subscription, paymentHistory }: SubscriptionSectionProps) {
  const statusColors = {
    active: 'bg-emerald-500/10 text-emerald-500',
    inactive: 'bg-muted text-muted-foreground',
    cancelled: 'bg-red-500/10 text-red-500',
    past_due: 'bg-yellow-500/10 text-yellow-500',
  };

  const statusLabels = {
    active: 'Ativo',
    inactive: 'Inativo',
    cancelled: 'Cancelado',
    past_due: 'Pagamento Pendente',
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/20 rounded-xl">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{subscription.planName}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                subscription.status === 'active' ? 'bg-emerald-500/20 text-emerald-200' : 'bg-red-500/20 text-red-200'
              }`}>
                {statusLabels[subscription.status]}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              R$ {subscription.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-primary-foreground/70">
              /{subscription.billingCycle === 'monthly' ? 'mês' : 'ano'}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {subscription.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary-foreground/80" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-primary-foreground/80 pt-3 border-t border-primary-foreground/20">
          <Calendar className="h-4 w-4" />
          <span>
            Próxima renovação: {format(new Date(subscription.renewalDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </span>
        </div>
      </div>

      {/* Available Plans */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Planos Disponíveis</h3>
        <div className="space-y-3">
          {plans.map(plan => {
            const isCurrentPlan = plan.name === subscription.planName.replace('Plano ', '');
            return (
              <div 
                key={plan.name}
                className={`bg-card border rounded-xl p-4 ${
                  isCurrentPlan ? 'border-primary' : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{plan.name}</h4>
                    {plan.popular && (
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        Popular
                      </span>
                    )}
                    {isCurrentPlan && (
                      <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full">
                        Atual
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-foreground">
                    R$ {plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    <span className="text-xs text-muted-foreground font-normal">/mês</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {plan.features.slice(0, 2).map((feature, idx) => (
                    <span key={idx} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
                {!isCurrentPlan && (
                  <button className="w-full mt-3 py-2 rounded-lg border border-primary text-primary font-medium text-sm hover:bg-primary/5 transition-colors">
                    {plan.price > subscription.amount ? 'Fazer Upgrade' : 'Fazer Downgrade'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Histórico de Pagamentos</h3>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {paymentHistory.map((payment, idx) => (
            <div 
              key={payment.id}
              className={`flex items-center gap-3 p-4 ${
                idx !== paymentHistory.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div className={`p-2 rounded-xl ${
                payment.status === 'paid' ? 'bg-emerald-500/10' : 'bg-yellow-500/10'
              }`}>
                {payment.status === 'paid' ? (
                  <CreditCard className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{payment.description}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(payment.date), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">
                  R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <span className={`text-xs ${
                  payment.status === 'paid' ? 'text-emerald-500' : 'text-yellow-500'
                }`}>
                  {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel */}
      <button className="w-full py-3 rounded-xl border border-destructive/20 text-destructive font-medium text-sm hover:bg-destructive/5 transition-colors">
        Cancelar Assinatura
      </button>
    </div>
  );
}
