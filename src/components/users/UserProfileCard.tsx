import { X, MapPin, MessageSquare, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SuspendConfirmDialog from "./SuspendConfirmDialog";
import { format } from "date-fns";

interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  accountType: string;
  isActive: boolean;
  createdAt: Date;
  location?: string;
  phone?: string;
  vendorProfile?: {
    id: number;
    businessName?: string;
    description?: string;
    city?: string;
    rating?: number;
    reviewCount?: number;
    verificationStatus?: string;
    isVerified?: boolean;
    subscriptionStatus?: string;
  };
}

interface UserProfileCardProps {
  user: UserProfile;
  onClose: () => void;
}

export default function UserProfileCard({ user, onClose }: UserProfileCardProps) {
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const isVendor = user.accountType === "VENDOR";
  const fullName = isVendor && user.vendorProfile?.businessName
    ? user.vendorProfile.businessName
    : `${user.firstName} ${user.lastName}`;
  const initials = isVendor && user.vendorProfile?.businessName
    ? user.vendorProfile.businessName.substring(0, 2).toUpperCase()
    : `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-sm p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            className="absolute top-4 right-4 p-1 hover:bg-muted rounded"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground mb-3">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-foreground">{fullName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {user.accountType.toUpperCase()}
              </span>
              <span className="text-sm text-muted-foreground">#{user.id}</span>
              <span className="text-sm text-muted-foreground">Joined {format(new Date(user.createdAt), "MMM d, yyyy")}</span>
            </div>
            {(user.location || user.vendorProfile?.city) && (
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {user.vendorProfile?.city || user.location}
              </div>
            )}
            {user.email && (
              <div className="text-sm text-muted-foreground mt-1">
                {user.email}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="border border-border rounded-xl divide-x divide-border flex mb-4">
            {isVendor && user.vendorProfile ? (
              <>
                <div className="flex-1 text-center py-4">
                  <p className="text-xl font-bold text-foreground">{user.vendorProfile.rating || 0}</p>
                  <p className="text-[10px] text-muted-foreground tracking-wider font-medium">★ RATING</p>
                </div>
                <div className="flex-1 text-center py-4">
                  <p className="text-xl font-bold text-foreground">{user.vendorProfile.reviewCount || 0}</p>
                  <p className="text-[10px] text-muted-foreground tracking-wider font-medium">REVIEWS</p>
                </div>
                <div className="flex-1 text-center py-4">
                  <p className="text-xl font-bold text-foreground">{user.vendorProfile.verificationStatus?.toUpperCase() || "PENDING"}</p>
                  <p className="text-[10px] text-muted-foreground tracking-wider font-medium">STATUS</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1 text-center py-4">
                  <p className="text-xl font-bold text-foreground">{user.phone || "-"}</p>
                  <p className="text-[10px] text-muted-foreground tracking-wider font-medium">PHONE</p>
                </div>
                <div className="flex-1 text-center py-4">
                  <p className="text-xl font-bold text-foreground">{user.isActive ? "Active" : "Inactive"}</p>
                  <p className="text-[10px] text-muted-foreground tracking-wider font-medium">STATUS</p>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          {isVendor ? (
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="w-4 h-4" /> Send Message
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setShowSuspendDialog(true)}
              >
                Suspend Account
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Button variant="outline">View Public Profile</Button>
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="w-4 h-4" /> Send Message
                </Button>
              </div>
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setShowSuspendDialog(true)}
              >
                Suspend Account
              </Button>
            </>
          )}
        </div>
      </div>

      {showSuspendDialog && (
        <SuspendConfirmDialog
          userName={fullName}
          onClose={() => setShowSuspendDialog(false)}
          onConfirm={() => {
            setShowSuspendDialog(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
