import { useState } from "react";
import { ArrowLeft, Paperclip, Smile, Send, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Messages data - replace with API integration when available
const mockMessages: any[] = [];

export default function Messages() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [filter, setFilter] = useState("all");

  const selected = mockMessages.find((m) => m.id === selectedId);

  if (selected) {
    return (
      <div className="flex gap-6 h-[calc(100vh-7rem)]">
        {/* Chat area */}
        <div className="flex-1 bg-card rounded-xl border border-border flex flex-col">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <button type="button" aria-label="Go back" onClick={() => setSelectedId(null)} className="p-1 hover:bg-muted rounded">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
              {selected.initials}
            </div>
            <div>
              <p className="font-semibold text-foreground">{selected.sender}</p>
              <p className="text-xs text-muted-foreground">Joined Since 2026</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {selected.messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.from === "admin" ? "items-end" : "items-start"} max-w-[75%] ${msg.from === "admin" ? "ml-auto" : ""}`}>
                <div className={`p-4 rounded-2xl text-sm ${msg.from === "admin" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                  {msg.text}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{msg.sender} • {msg.time}</p>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border flex items-center gap-3">
            <button type="button" aria-label="Attach file" className="p-2 hover:bg-muted rounded-lg"><Paperclip className="w-5 h-5 text-muted-foreground" /></button>
            <button type="button" aria-label="Add emoji" className="p-2 hover:bg-muted rounded-lg"><Smile className="w-5 h-5 text-muted-foreground" /></button>
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
        </div>

        {/* Right panel */}
        <div className="w-80 space-y-4">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <span>💬</span> INITIAL MESSAGE
            </div>
            <p className="text-sm text-foreground leading-relaxed">{selected.messages[0]?.text}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground">Shared Files</h4>
              <button type="button" aria-label="View all files" className="text-xs text-primary font-medium">View All</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary text-xs">📷</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Screenshot_1.png</p>
                  <p className="text-xs text-muted-foreground">156 KB • Oct 14</p>
                </div>
              </div>
              <button type="button" aria-label="Download file" className="p-1"><Download className="w-4 h-4 text-muted-foreground" /></button>
            </div>
          </div>
          <Button className="w-full bg-success hover:bg-success/90 text-success-foreground font-semibold">
            Mark as resolved
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Messages</h1>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="bg-muted">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="support">Support Tickets</TabsTrigger>
          <TabsTrigger value="flags">Flags</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {mockMessages.map((msg) => (
          <button
            key={msg.id}
            onClick={() => setSelectedId(msg.id)}
            className="w-full bg-card rounded-xl border border-border p-5 flex items-start gap-4 hover:border-primary/30 transition-colors text-left"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                {msg.initials}
              </div>
              {msg.unread && <span className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-card" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground">{msg.sender}</p>
                <p className="text-xs text-muted-foreground">{msg.time}</p>
              </div>
              <p className="text-sm text-muted-foreground truncate mt-0.5">{msg.preview}</p>
              <span className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded ${msg.tag === "Support" ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary"}`}>
                {msg.tag}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
