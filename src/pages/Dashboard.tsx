import { AlertCircle, TrendingUp, ChevronRight, Users as UsersIcon, UserCheck } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";

const stats = [
  { label: "New Customers", value: "18", change: "+12%", positive: true },
  { label: "New Vendors", value: "7", change: "+5%", positive: true },
  { label: "Pending Verifications", value: "12", alert: true },
  { label: "Open Tickets", value: "5", change: "Stable" },
  { label: "Total Revenue", value: "$42,500", highlight: true },
];

const growthData = [
  { month: "JAN", vendors: 200, users: 400 },
  { month: "MAR", vendors: 400, users: 800 },
  { month: "MAY", vendors: 800, users: 1500 },
  { month: "JUL", vendors: 1200, users: 2500 },
  { month: "SEP", vendors: 2000, users: 4500 },
  { month: "NOV", vendors: 3000, users: 6500 },
  { month: "DEC", vendors: 3500, users: 8000 },
];

const pieData = [
  { name: "Verified", value: 70, color: "hsl(21, 90%, 56%)" },
  { name: "Pending", value: 20, color: "hsl(0, 0%, 20%)" },
  { name: "Rejected", value: 10, color: "hsl(0, 0%, 85%)" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground">Good morning, Alex. Here's what's happening today.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`bg-card rounded-xl border p-4 space-y-2 ${
              s.alert ? "border-primary/40" : "border-border"
            }`}
          >
            <p className={`text-sm ${s.alert ? "text-primary font-semibold" : "text-muted-foreground"}`}>
              {s.label}
            </p>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${s.alert ? "text-primary" : "text-foreground"}`}>
                {s.value}
              </span>
              {s.alert && <AlertCircle className="w-5 h-5 text-primary" />}
              {s.change && !s.alert && (
                <span className={`text-xs font-medium ${s.positive ? "text-success" : "text-muted-foreground"}`}>
                  {s.change}
                </span>
              )}
              {s.highlight && (
                <span className="ml-auto bg-success/20 text-success text-xs px-2 py-0.5 rounded-full">●</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth chart */}
        <div className="col-span-1 lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">User & Vendor Growth</h2>
              <p className="text-sm text-muted-foreground">
                Cumulative platform expansion over the last 12 months
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Vendors
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-foreground" /> Users
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="vendorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(21, 90%, 56%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(21, 90%, 56%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis hide />
              <Tooltip />
              <Area type="monotone" dataKey="vendors" stroke="hsl(21, 90%, 56%)" fill="url(#vendorGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="users" stroke="hsl(0, 0%, 15%)" fill="transparent" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Verification pie */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Verification Status</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <PieChart width={120} height={120}>
                  <Pie
                    data={pieData}
                    cx={60}
                    cy={60}
                    innerRadius={38}
                    outerRadius={55}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-foreground">8,421</span>
                  <span className="text-[10px] text-muted-foreground tracking-widest">TOTAL</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name} <span className="font-bold">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
            <p className="text-sm text-muted-foreground mb-4">Frequently used management tools</p>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                <span className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Verify New Users</span>
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                <span className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Resolve Report</span>
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System status */}
      <div className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground tracking-wider font-medium">SYSTEM STATUS</p>
            <p className="text-sm font-semibold text-foreground">Server Health</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-sm font-medium text-success">
          <span className="w-2 h-2 rounded-full bg-success" /> HEALTHY
        </span>
      </div>
    </div>
  );
}
