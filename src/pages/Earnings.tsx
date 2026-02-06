import { Download, TrendingUp, DollarSign, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const trendData = [
  { month: "Apr", revenue: 20000 },
  { month: "May", revenue: 25000 },
  { month: "Jun", revenue: 35000 },
  { month: "Jul", revenue: 28000 },
  { month: "Aug", revenue: 42000 },
  { month: "Sep", revenue: 38000 },
  { month: "Oct", revenue: 45000 },
];

const vendors = [
  { name: "Bamboo Grove Retreat", initials: "BG", tier: "FREE PLAN", earnings: "UGX 0.00", tierColor: "text-success" },
  { name: "Elite Garden Venues", initials: "EG", tier: "PAID PLAN", earnings: "UGX 18,200.00", tierColor: "text-primary" },
];

export default function Earnings() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Earnings Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-base">Track marketplace revenue, vendor performance and pending payouts.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" /> Oct 01 - Oct 31, 2023
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xs font-medium text-success flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +5%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Overall Earnings</p>
          <p className="text-2xl font-bold text-foreground">UGX 52,450,000.00</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xs font-medium text-success flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Total Earnings This Month</p>
          <p className="text-2xl font-bold text-foreground">UGX 12,450,000.00</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Users className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">Updated 2h ago</span>
          </div>
          <p className="text-sm text-muted-foreground">Subscribed Vendors</p>
          <p className="text-2xl font-bold text-foreground">89</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vendor performance table */}
        <div className="col-span-1 lg:col-span-2 bg-card rounded-xl border border-border overflow-x-auto">
          <div className="p-4 flex items-center justify-between border-b border-border">
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground">VENDOR PERFORMANCE</h3>
            <div className="relative w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Filter by vendor name..." className="pl-10 h-9 border-border" />
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">VENDOR NAME</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">SUBSCRIPTION TIER</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">TOTAL EARNINGS</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.name} className="border-b border-border last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-success/20 flex items-center justify-center text-xs font-semibold text-success">
                        {v.initials}
                      </div>
                      <span className="font-medium text-foreground">{v.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold ${v.tierColor} bg-success/10 px-2 py-0.5 rounded`}>
                      {v.tier}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{v.earnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 flex items-center justify-between border-t border-border">
            <p className="text-sm text-muted-foreground">Showing 1 to 4 of 89 vendors</p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button size="sm" className="bg-primary text-primary-foreground h-8 w-8 p-0">1</Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">2</Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">3</Button>
              <span className="px-1 text-muted-foreground">…</span>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">23</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </div>

        {/* Trend chart */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground">Earnings Trend</h3>
          <p className="text-sm text-muted-foreground mb-4">Monthly revenue growth and performance overview</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="hsl(142, 71%, 45%)" strokeWidth={3} dot={{ r: 4, fill: "hsl(142, 71%, 45%)" }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success" /> Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> High Peak</span>
          </div>
        </div>
      </div>
    </div>
  );
}
