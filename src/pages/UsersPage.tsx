import { useState } from "react";
import { Search, Download, Eye, Trash2, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserProfileCard from "@/components/users/UserProfileCard";

const mockUsers = [
  { id: "USR-8895", name: "Marcus Chen", initials: "MC", email: "marcus.v@vendor.co", role: "Vendor" as const, joinDate: "Sep 28, 2023", location: "Kampala, Uganda.", events: 12, yearsExp: 5, rating: 4.9, totalReviews: 84 },
  { id: "USR-8902", name: "Sarah Jenkins", initials: "SJ", email: "s.jenkins@example.com", role: "Host" as const, joinDate: "Oct 12, 2023", location: "Kampala, Uganda.", eventsHosted: 12, reviewsGiven: 25, vendorsBooked: 8 },
  { id: "USR-8831", name: "Royal Touch Decor", initials: "RD", email: "thomas@eventsplus.org", role: "Vendor" as const, joinDate: "Jul 30, 2023", location: "Kampala, Uganda.", events: 12, yearsExp: 5, rating: 4.9, totalReviews: 84 },
  { id: "USR-8842", name: "Elena Rodriguez", initials: "ER", email: "e.rodriguez@mail.com", role: "Host" as const, joinDate: "Aug 15, 2023", location: "Kampala, Uganda.", eventsHosted: 8, reviewsGiven: 15, vendorsBooked: 5 },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground text-sm md:text-base">Manage, filter, and monitor all platform participants.</p>
        </div>
        <Button variant="outline" className="gap-2 self-start">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or ID..."
            className="pl-10 border-none bg-secondary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="vendor">Vendor</SelectItem>
            <SelectItem value="host">Host</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="w-4 h-4" /> More Filters
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">USER ID</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">NAME</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">EMAIL</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">ROLE</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wider">JOIN DATE</th>
              <th className="text-right p-4 text-xs font-semibold text-muted-foreground tracking-wider">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedUser(user)}>
                <td className="p-4 text-muted-foreground">#{user.id}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">
                      {user.initials}
                    </div>
                    <span className="font-medium text-foreground">{user.name}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{user.email}</td>
                <td className="p-4">
                  <span className="bg-accent text-accent-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{user.joinDate}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                      onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}
                    >
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" onClick={(e) => e.stopPropagation()}>
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 flex items-center justify-between border-t border-border">
          <p className="text-sm text-muted-foreground">Showing 1 to 4 of 1,234 users</p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button size="sm" className="bg-primary text-primary-foreground h-8 w-8 p-0">1</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">2</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">3</Button>
            <span className="px-1 text-muted-foreground">…</span>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">124</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>

      {selectedUser && (
        <UserProfileCard
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
