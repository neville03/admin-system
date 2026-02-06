import { useState } from "react";
import { Search, Eye, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TicketDetailPanel from "@/components/support/TicketDetailPanel";
import FlagDetailPanel from "@/components/support/FlagDetailPanel";

const tickets = [
  {
    id: "TK-8842",
    subject: "Rude host during booking process",
    reporter: "Sarah Jenkins",
    initials: "SJ",
    status: "OPEN" as const,
    date: "Oct 24, 2023",
    initialMessage: "This host was extremely rude and unprofessional during the booking process. I tried to ask about the catering options for my corporate event and they ghosted me for three days, then replied with a single word \"No\". I would like a refund or a formal investigation into their behavior.",
    reporterRole: "Host",
    memberSince: "2022",
    messages: [
      { from: "user" as const, text: "I've attached the screenshots of the chat logs for your review.", time: "10:24 AM", sender: "Sarah Jenkins" },
      { from: "admin" as const, text: "Hello Sarah, thank you for reaching out. We are currently reviewing the screenshots provided and will take appropriate action. One of our specialists will get back to you within 2 hours.", time: "10:45 AM", sender: "Admin (Support Team)" },
      { from: "user" as const, text: "Thank you. Please let me know if you need any further information from my side.", time: "11:02 AM", sender: "Sarah Jenkins" },
    ],
  },
  {
    id: "TK-8843",
    subject: "Payment not received for event",
    reporter: "John Smith",
    initials: "JS",
    status: "OPEN" as const,
    date: "Oct 25, 2023",
    initialMessage: "I completed an event 2 weeks ago but haven't received payment yet.",
    reporterRole: "Vendor",
    memberSince: "2021",
    messages: [],
  },
];

const flags = [
  { id: "FL-2091", content: "This host was extremely rude and unprofessional. They canceled my booking 2 hours before the event with no explanation and then blocked my phone number when I tried to call for a refund. Extremely disappointed.", flagger: "Sarah Jenkins", fInitials: "SJ", fRole: "Host", vendor: "Royal Touch Decor", vInitials: "RT", vRole: "Vendor", reason: "Harassment", flaggedDate: "Feb 5, 2026" },
  { id: "FL-2092", content: "Wonderful service, very polite and professional throughout.", flagger: "John Smith", fInitials: "JS", fRole: "Host", vendor: "Emily Johnson", vInitials: "EJ", vRole: "Vendor", reason: "Positive Feedback", flaggedDate: "Feb 3, 2026" },
  { id: "FL-2093", content: "The check-in process was chaotic and disorganized.", flagger: "Michael Brown", fInitials: "MB", fRole: "Host", vendor: "Lisa White", vInitials: "LW", vRole: "Vendor", reason: "Negative Experience", flaggedDate: "Feb 1, 2026" },
];

export default function Support() {
  const [tab, setTab] = useState("flags");
  const [selectedTicket, setSelectedTicket] = useState<typeof tickets[0] | null>(null);
  const [selectedFlag, setSelectedFlag] = useState<typeof flags[0] | null>(null);

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
          <div className="bg-card rounded-xl border border-border">
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
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
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
                      <button className="p-1.5 hover:bg-muted rounded-lg" onClick={() => setSelectedTicket(t)}>
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
          <div className="bg-card rounded-xl border border-border">
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
                  <tr key={f.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
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
                        <button className="p-1.5 hover:bg-muted rounded-lg" onClick={() => setSelectedFlag(f)}>
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 hover:bg-muted rounded-lg">
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
