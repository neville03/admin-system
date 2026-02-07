import { useState } from "react";
import { Download, Search, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVerifications } from "@/lib/api/hooks";

export default function Verifications() {
  const [selected, setSelected] = useState<string | null>(null);
  const { data, isLoading, error } = useVerifications({ status: "pending" });

  const verifications = data?.verifications || [];
  const totalPending = data?.total || 0;

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return "UN";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    }
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">Pending Verifications</h1>
            <span className="bg-foreground text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
              {isLoading ? "..." : totalPending}
            </span>
          </div>
          <p className="text-muted-foreground">Review and process recent verification requests.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vendor list */}
        <div className="col-span-1 lg:col-span-2 bg-card rounded-xl border border-border overflow-x-auto">
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
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-muted-foreground">
                    Loading verifications...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-red-500">
                    Failed to load verifications
                  </td>
                </tr>
              ) : verifications.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-muted-foreground">
                    No pending verifications
                  </td>
                </tr>
              ) : (
                verifications.map((v: any) => (
                  <tr key={v.id} className="border-b border-border last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">
                          {getInitials(v.user?.firstName, v.user?.lastName)}
                        </div>
                        <div>
                          <span className="font-medium text-foreground">
                            {v.user?.firstName} {v.user?.lastName}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {v.vendorProfile?.businessName || "Unknown Business"}
                          </p>
                          <p className="text-xs text-muted-foreground">ID: #{v.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{formatDate(v.uploadedAt)}</td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => setSelected(v.id.toString())}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Review panel */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Review Request</h3>
            <button className="p-1 hover:bg-muted rounded" aria-label="Close panel">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          {selected ? (
            <div className="text-center text-muted-foreground text-sm">
              <p>Review details for verification {selected}</p>
              {/* TODO: Add verification detail panel */}
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
