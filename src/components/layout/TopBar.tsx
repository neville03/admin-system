import { Bell, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TopBarProps {
  onMenuToggle: () => void;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="p-2 hover:bg-muted rounded-lg lg:hidden">
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="relative hidden sm:block w-64 md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search for users, listings or transactions..."
            className="pl-10 bg-secondary border-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button className="relative p-2 rounded-lg hover:bg-muted">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground">Alex Rivera</p>
            <p className="text-xs text-muted-foreground">Super Admin</p>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
            AR
          </div>
        </div>
      </div>
    </header>
  );
}
