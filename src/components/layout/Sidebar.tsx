import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Monitor,
  ShieldCheck,
  Flag,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import logo from "@/assets/logo-sidebar.png";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/users", label: "Users", icon: Users },
  { to: "/earnings", label: "Earnings", icon: Monitor },
  { to: "/verifications", label: "Verifications", icon: ShieldCheck },
  { to: "/support", label: "Support & Flags", icon: Flag },
];

const bottomItems = [
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-accent text-accent-foreground border-l-4 border-primary -ml-px"
        : "text-sidebar-foreground hover:bg-muted"
    }`;

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col h-screen
        transition-transform duration-200 ease-in-out
        lg:sticky lg:top-0 lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Logo */}
      <div className="p-5 flex items-center">
        <img src={logo} alt="Event Bridge" className="h-14 w-auto" />
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom nav */}
      <nav className="px-3 pb-4 space-y-1">
        {bottomItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
        <button
          onClick={() => {
            localStorage.removeItem("auth_token");
            navigate("/");
            onClose();
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-muted w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </nav>
    </aside>
  );
}
