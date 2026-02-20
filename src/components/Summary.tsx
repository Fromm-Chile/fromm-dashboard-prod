import { Inbox, Clock, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SummaryProps = {
  total: number;
  pendiente: number;
  enviada?: number | string;
  tituloTotal?: string;
  tituloPendiente?: string;
  tituloEnviada?: string;
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
  hasBorder = true,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  iconBg: string;
  iconColor: string;
  hasBorder?: boolean;
}) => (
  <div
    className={`flex gap-4 items-center flex-1 ${
      hasBorder ? "border-r border-border pr-8" : ""
    }`}
  >
    <div
      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}
    >
      <Icon size={20} className={iconColor} strokeWidth={1.8} />
    </div>
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
    </div>
  </div>
);

export const Summary = ({
  total,
  pendiente,
  enviada,
  tituloTotal = "Cotizaciones totales",
  tituloPendiente = "Cotizaciones pendientes",
  tituloEnviada = "Cotizaciones enviadas",
}: SummaryProps) => {
  return (
    <div className="w-full bg-card border border-border rounded-2xl shadow-sm flex items-center px-8 py-5 mb-5 gap-8">
      <StatCard
        icon={Inbox}
        label={tituloTotal}
        value={total}
        iconBg="bg-red-500/10"
        iconColor="text-red-500"
      />
      <StatCard
        icon={Clock}
        label={tituloPendiente}
        value={pendiente}
        iconBg="bg-amber-500/10"
        iconColor="text-amber-500"
      />
      <StatCard
        icon={Send}
        label={tituloEnviada}
        value={enviada ?? 0}
        iconBg="bg-emerald-500/10"
        iconColor="text-emerald-500"
        hasBorder={false}
      />
    </div>
  );
};
