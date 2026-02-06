import { useState } from "react";
import { X, MessageSquare, Paperclip, Smile, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TicketMessage {
  from: "user" | "admin";
  text: string;
  time: string;
  sender: string;
}

interface TicketDetail {
  id: string;
  status: "OPEN" | "CLOSED";
  initialMessage: string;
  reporter: {
    name: string;
    initials: string;
    role: string;
    memberSince: string;
  };
  messages: TicketMessage[];
}

interface TicketDetailPanelProps {
  ticket: TicketDetail;
  onClose: () => void;
}

export default function TicketDetailPanel({ ticket, onClose }: TicketDetailPanelProps) {
  const [messageInput, setMessageInput] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-foreground">Support Ticket Details #{ticket.id}</h2>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              ticket.status === "OPEN"
                ? "bg-success/20 text-success"
                : "bg-muted text-muted-foreground"
            }`}>
              {ticket.status}
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Initial message */}
          <div className="bg-muted/50 rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs text-primary font-semibold mb-3">
              <MessageSquare className="w-3.5 h-3.5" /> INITIAL MESSAGE
            </div>
            <p className="text-sm text-foreground leading-relaxed">{ticket.initialMessage}</p>
          </div>

          {/* Reporter */}
          <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
              {ticket.reporter.initials}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{ticket.reporter.name}</p>
              <p className="text-xs text-muted-foreground">{ticket.reporter.role} • Member since {ticket.reporter.memberSince}</p>
            </div>
            <button className="p-2 hover:bg-muted rounded-lg">
              <MessageSquare className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* Conversation thread */}
          {ticket.messages.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-primary tracking-wider text-center mb-4">CONVERSATION THREAD</p>
              <div className="space-y-4">
                {ticket.messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.from === "admin" ? "items-end" : "items-start"}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                      msg.from === "admin"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}>
                      {msg.text}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{msg.sender} • {msg.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Message input + resolve */}
        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-muted rounded-lg"><Paperclip className="w-5 h-5 text-muted-foreground" /></button>
            <button className="p-2 hover:bg-muted rounded-lg"><Smile className="w-5 h-5 text-muted-foreground" /></button>
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button size="icon" className="bg-primary text-primary-foreground">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex justify-end">
            <Button className="bg-success hover:bg-success/90 text-success-foreground font-semibold">
              Mark as resolved
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
