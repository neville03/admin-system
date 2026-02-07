import { SlidersHorizontal, Users, ShieldCheck, CreditCard, ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const sections = [
  { 
    icon: SlidersHorizontal, 
    title: "General Settings", 
    desc: "Site name, brand assets, and display rules.",
    path: "/settings/general"
  },
  { 
    icon: Users, 
    title: "Team & Access", 
    desc: "Manage administrative roles and permissions.",
    path: "/settings/team"
  },
  { 
    icon: ShieldCheck, 
    title: "Roles & Permissions", 
    desc: "Define access levels and moderator capabilities.",
    path: "/settings/roles"
  },
  { 
    icon: CreditCard, 
    title: "Payment Settings", 
    desc: "Configure gateways, currencies, and payouts.",
    path: "/settings/payments"
  },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on a sub-page
  const isSubPage = location.pathname !== "/settings";

  if (!isSubPage) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
          <p className="text-muted-foreground">Manage and configure your platform-wide preferences.</p>
        </div>

        <div className="space-y-4">
          {sections.map((s) => (
            <button
              key={s.path}
              onClick={() => navigate(s.path)}
              className="w-full bg-card rounded-xl border border-border p-5 flex items-center gap-4 hover:border-primary/30 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <s.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Render sub-page based on path
  const currentSection = sections.find(s => location.pathname.startsWith(s.path));
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/settings")}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Back to settings"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {currentSection?.title || "Settings"}
          </h1>
          <p className="text-muted-foreground">{currentSection?.desc}</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <p className="text-muted-foreground">
          This section is under construction. Full functionality coming soon.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          API endpoints are available at:
        </p>
        <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside">
          <li>GET /api/settings/general</li>
          <li>PUT /api/settings/general</li>
          <li>GET /api/settings/team</li>
          <li>GET /api/settings/roles</li>
          <li>GET /api/settings/payments</li>
          <li>GET /api/settings/audit-logs</li>
        </ul>
      </div>
    </div>
  );
}
