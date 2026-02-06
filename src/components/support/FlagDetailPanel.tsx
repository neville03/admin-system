import { X, MessageSquare, Ban, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FlagDetail {
  id: string;
  status: "PENDING REVIEW" | "RESOLVED";
  content: string;
  reason: string;
  flaggedDate: string;
  flagger: { name: string; initials: string; role: string };
  target: { name: string; initials: string; role: string };
}

interface FlagDetailPanelProps {
  flag: FlagDetail;
  onClose: () => void;
}

export default function FlagDetailPanel({ flag, onClose }: FlagDetailPanelProps) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-foreground">Flagged Content Details #{flag.id}</h2>
            <span className="bg-primary/15 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {flag.status}
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Quoted content */}
          <div className="border-l-4 border-destructive/40 bg-muted/30 rounded-r-xl p-5">
            <p className="text-sm text-foreground leading-relaxed italic">"{flag.content}"</p>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5" /> Reason: {flag.reason}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
              <Calendar className="w-3.5 h-3.5" /> Flagged on {flag.flaggedDate}
            </span>
          </div>

          {/* Flagger & Target */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-3">FLAGGER</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                  {flag.flagger.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{flag.flagger.name}</p>
                  <p className="text-xs text-muted-foreground">{flag.flagger.role}</p>
                </div>
                <button className="p-1.5 hover:bg-muted rounded-lg ml-auto">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-3">TARGET</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                  {flag.target.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{flag.target.name}</p>
                  <p className="text-xs text-muted-foreground">{flag.target.role}</p>
                </div>
                <div className="flex gap-1 ml-auto">
                  <button className="p-1.5 hover:bg-muted rounded-lg">
                    <Ban className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-1.5 hover:bg-muted rounded-lg">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="flex justify-end pt-2">
            <Button className="bg-success hover:bg-success/90 text-success-foreground font-semibold px-6">
              Mark as resolved
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
