import { useState } from "react";
import { Download, Search, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockVendors = [
  { id: "#4492", name: "Marcus Thorne", initials: "MT", submittedAt: "2 hours ago" },
];

export default function Verifications() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">Pending Verifications</h1>
            <span className="bg-foreground text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">12</span>
          </div>
          <p className="text-muted-foreground">Review and process recent verification requests.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Vendor list */}
        <div className="col-span-2 bg-card rounded-xl border border-border">
          <div className="p-4 flex items-center justify-between border-b border-border">
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground">VENDOR LIST</h3>
            <div className="relative w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Filter by vendor name..." className="pl-10 h-9 border-border" />
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">USER/VENDOR</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">SUBMISSION DATE</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {mockVendors.map((v) => (
                <tr key={v.id} className="border-b border-border last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">
                        {v.initials}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{v.name}</span>
                        <p className="text-xs text-muted-foreground">ID: {v.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{v.submittedAt}</td>
                  <td className="p-4">
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => setSelected(v.id)}
                    >
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Review panel */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Review Request</h3>
            <button className="p-1 hover:bg-muted rounded">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          {selected ? (
            <div className="text-center text-muted-foreground text-sm">
              <p>Review details for vendor {selected}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Image className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Pick a Vendor for Review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
