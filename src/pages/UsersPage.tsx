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
import { useUsers } from "@/lib/api/hooks";
import { format } from "date-fns";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data, isLoading } = useUsers({
    role: roleFilter,
    search: search || undefined,
    limit: pageSize,
    page: page,
  });

  const users = (data?.users || []).map((user) => ({
    id: user.id,
    name: user.accountType === "VENDOR" && (user as any).businessName
      ? (user as any).businessName
      : `${user.firstName} ${user.lastName}`,
    initials: user.accountType === "VENDOR" && (user as any).businessName
      ? (user as any).businessName.substring(0, 2).toUpperCase()
      : `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase(),
    email: user.email,
    role: user.accountType === "VENDOR" ? "Vendor" : "Host",
    joinDate: format(new Date(user.createdAt), "MMM d, yyyy"),
    location: user.location || undefined,
    isActive: user.isActive,
  }));

  const totalUsers = data?.total || 0;
  const totalPages = Math.ceil(totalUsers / pageSize);

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
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <Select value={roleFilter} onValueChange={(value) => {
          setRoleFilter(value);
          setPage(0);
        }}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="vendor">Vendor</SelectItem>
            <SelectItem value="host">Host</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="w-4 h-4" /> More Filters
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
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
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
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
                            title="View details"
                          >
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                            onClick={(e) => e.stopPropagation()}
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalUsers > 0 && (
              <div className="p-4 flex items-center justify-between border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, totalUsers)} of {totalUsers} users
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (page < 2) {
                      pageNum = i;
                    } else if (page > totalPages - 3) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        className={page === pageNum ? "bg-primary text-primary-foreground h-8 w-8 p-0" : "h-8 w-8 p-0"}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum + 1}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
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
