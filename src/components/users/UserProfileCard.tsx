import { X, MapPin, MessageSquare, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SuspendConfirmDialog from "./SuspendConfirmDialog";

interface UserProfile {
  id: string;
  name: string;
  initials: string;
  role: "Vendor" | "Host";
  joinDate: string;
  location?: string;
  eventsHosted?: number;
  reviewsGiven?: number;
  vendorsBooked?: number;
  events?: number;
  yearsExp?: number;
  rating?: number;
  totalReviews?: number;
}

interface UserProfileCardProps {
  user: UserProfile;
  onClose: () => void;
}

export default function UserProfileCard({ user, onClose }: UserProfileCardProps) {
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const isHost = user.role === "Host";

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-sm p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-muted rounded">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground mb-3">
              {user.initials}
            </div>
            <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {user.role.toUpperCase()}
              </span>
              <span className="text-sm text-muted-foreground">#{user.id}</span>
              <span className="text-sm text-muted-foreground">Joined {user.joinDate}</span>
            </div>
            {user.location && (
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {user.location}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="border border-border rounded-xl divide-x divide-border flex mb-4">
            {isHost ? (
              <>
                <div className="flex-1 text-center py-4">
                  <p className="text-xl font-bold text-foreground">{user.eventsHosted ?? 0}</p>
                  <p className="text-[10px] text-muted-foreground tracking-wider font-medium">EVENTS HOSTED</p>
                </div>
                <div className="flex-1 text-center py-4">
                  <p className="text-xl font-bold text-foreground">{user.reviewsGiven ?? 0}</p>
                  <p className="text-[10px] text-muted-foreground tracking-wider font-medium">REVIEWS GIVEN</p>
                </div>
                <div className="flex-1 text-center py-4">
                  <p className="text-xl font-bold text-foreground">{user.vendorsBooked ?? 0}</p>
                  <p className="text-[10px] text-muted-foreground tracking-wider font-medium">VENDORS BOOKED</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1 text-center py-4">
                  <p className="text-xl font-bold text-foreground">{user.events ?? 0}</p>
                  <p className="text-[10px] text-muted-foreground tracking-wider font-medium">EVENTS</p>
                </div>
                <div className="flex-1 text-center py-4">
                  <p className="text-xl font-bold text-foreground">{user.yearsExp ?? 0}</p>
                  <p className="text-[10px] text-muted-foreground tracking-wider font-medium">YEARS EXP</p>
                </div>
                <div className="flex-1 text-center py-4">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xl font-bold text-foreground">★ {user.rating ?? 0}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground tracking-wider font-medium">{user.totalReviews ?? 0} REVIEWS</p>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          {isHost ? (
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
          userName={user.name}
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
