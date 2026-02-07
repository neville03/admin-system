import { useState } from "react";
import { Search, Eye, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TicketDetailPanel from "@/components/support/TicketDetailPanel";
import FlagDetailPanel from "@/components/support/FlagDetailPanel";
import { useSupportTickets, useFlags } from "@/lib/api/hooks";

export default function Support() {
  const [tab, setTab] = useState("flags");
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [selectedFlag, setSelectedFlag] = useState<any | null>(null);

  const { data: ticketsData, isLoading: ticketsLoading } = useSupportTickets({ status: "OPEN" });
  const { data: flagsData, isLoading: flagsLoading } = useFlags({ status: "PENDING" });

  const tickets = ticketsData?.tickets || [];
  const flags = flagsData?.flags || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Support & Moderation</h1>
        <p className="text-muted-foreground">Monitor support tickets and moderate flagged marketplace content.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-auto gap-6">
          <TabsTrigger
            value="tickets"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-3 px-0"
          >
            Support Tickets <span className="ml-2 bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">12</span>
          </TabsTrigger>
          <TabsTrigger
            value="flags"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-3 px-0"
          >
            Flagged Content <span className="ml-2 bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">5</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="mt-6">
          <div className="bg-card rounded-xl border border-border overflow-x-auto">
            <div className="p-4 border-b border-border">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search tickets..." className="pl-10 border-none bg-secondary" />
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">ID</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">SUBJECT</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">REPORTER</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">STATUS</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">DATE</th>
                  <th className="text-right p-4 text-xs font-semibold text-muted-foreground tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedTicket(t)}>
                    <td className="p-4 font-medium text-foreground">#{t.id}</td>
                    <td className="p-4 text-muted-foreground max-w-[200px] truncate">{t.subject}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold">{t.initials}</div>
                        <span className="text-foreground">{t.reporter}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-success/20 text-success text-xs font-semibold px-2 py-0.5 rounded-full">{t.status}</span>
                    </td>
                    <td className="p-4 text-muted-foreground">{t.date}</td>
                    <td className="p-4 text-right">
                      <button type="button" aria-label={`View ticket ${t.id}`} className="p-1.5 hover:bg-muted rounded-lg" onClick={(e) => { e.stopPropagation(); setSelectedTicket(t); }}>
                          <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="flags" className="mt-6">
          <div className="bg-card rounded-xl border border-border overflow-x-auto">
            <div className="p-4 border-b border-border">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search flagged items, users, or content..." className="pl-10 border-none bg-secondary" />
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">ID</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">CONTENT PREVIEW</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">FLAGGER</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">VENDOR</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">REASON</th>
                  <th className="text-right p-4 text-xs font-semibold text-muted-foreground tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {flags.map((f) => (
                  <tr key={f.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedFlag(f)}>
                    <td className="p-4 font-medium text-foreground">#{f.id}</td>
                    <td className="p-4 text-muted-foreground max-w-[200px] truncate">{f.content}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold">{f.fInitials}</div>
                        <span className="text-foreground">{f.flagger}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold">{f.vInitials}</div>
                        <span className="text-foreground">{f.vendor}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{f.reason}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" aria-label={`View flag ${f.id}`} className="p-1.5 hover:bg-muted rounded-lg" onClick={(e) => { e.stopPropagation(); setSelectedFlag(f); }}>
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button type="button" aria-label={`Delete flag ${f.id}`} className="p-1.5 hover:bg-muted rounded-lg" onClick={(e) => e.stopPropagation()}>
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 flex items-center justify-between border-t border-border">
              <p className="text-sm text-muted-foreground">Showing 1 to 3 of 5 flagged items</p>
              <div className="flex gap-1">
                <button className="px-3 py-1.5 text-sm border border-border rounded-lg text-muted-foreground">Previous</button>
                <button className="px-3 py-1.5 text-sm border border-border rounded-lg font-medium">Next</button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {selectedTicket && (
        <TicketDetailPanel
          ticket={{
            id: selectedTicket.id,
            status: selectedTicket.status,
            initialMessage: selectedTicket.initialMessage,
            reporter: {
              name: selectedTicket.reporter,
              initials: selectedTicket.initials,
              role: selectedTicket.reporterRole,
              memberSince: selectedTicket.memberSince,
            },
            messages: selectedTicket.messages,
          }}
          onClose={() => setSelectedTicket(null)}
        />
      )}

      {selectedFlag && (
        <FlagDetailPanel
          flag={{
            id: selectedFlag.id,
            status: "PENDING REVIEW",
            content: selectedFlag.content,
            reason: selectedFlag.reason,
            flaggedDate: selectedFlag.flaggedDate,
            flagger: { name: selectedFlag.flagger, initials: selectedFlag.fInitials, role: selectedFlag.fRole },
            target: { name: selectedFlag.vendor, initials: selectedFlag.vInitials, role: selectedFlag.vRole },
          }}
          onClose={() => setSelectedFlag(null)}
        />
      )}
    </div>
  );
}
