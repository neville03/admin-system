import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuspendConfirmDialogProps {
  userName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function SuspendConfirmDialog({ userName, onClose, onConfirm }: SuspendConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-sm p-8 relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-muted rounded">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-primary" />
        </div>

        <h2 className="text-xl font-bold text-foreground mb-2">
          Are you absolutely sure you want to delete this account?
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          This action is irreversible. Deleting your account will immediately remove your vendor profile,
          portfolio, active leads, and earnings history.
        </p>

        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-semibold"
          onClick={onConfirm}
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}
