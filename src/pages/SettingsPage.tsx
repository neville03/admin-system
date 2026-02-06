import { SlidersHorizontal, Users, ShieldCheck, CreditCard, ChevronDown } from "lucide-react";

const sections = [
  { icon: SlidersHorizontal, title: "General Settings", desc: "Site name, brand assets, and display rules." },
  { icon: Users, title: "Team & Access", desc: "Manage administrative roles and permissions." },
  { icon: ShieldCheck, title: "Roles & Permissions", desc: "Define access levels and moderator capabilities." },
  { icon: CreditCard, title: "Payment Settings", desc: "Configure gateways, currencies, and payouts." },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
        <p className="text-muted-foreground">Manage and configure your platform-wide preferences.</p>
      </div>

      <div className="space-y-4">
        {sections.map((s) => (
          <button
            key={s.title}
            className="w-full bg-card rounded-xl border border-border p-5 flex items-center gap-4 hover:border-primary/30 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <s.icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
