import { useState, useEffect } from "react";
import { ArrowLeft, Paperclip, Smile, Send, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: number;
  text: string;
  from: "admin" | "user";
  sender: string;
  time: string;
}

interface Conversation {
  id: string;
  sender: string;
  initials: string;
  time: string;
  preview: string;
  unread: boolean;
  tag: "Support" | "Flag";
  priority: string;
  status: string;
  messages: Message[];
  threadType: "support" | "flag";
}

export default function Messages() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const selected = conversations.find((m) => m.id === selectedId);

  useEffect(() => {
    fetchConversations();
  }, [filter]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      // Fetch support tickets
      const ticketsResponse = await fetch("/api/support/tickets");
      const ticketsData = await ticketsResponse.json();

      // Fetch flags
      const flagsResponse = await fetch("/api/support/flags");
      const flagsData = await flagsResponse.json();

      const supportConversations: Conversation[] = (ticketsData.tickets || []).map(
        (ticket: any) => ({
          id: `support-${ticket.id}`,
          sender: ticket.reporter
            ? `${ticket.reporter.firstName} ${ticket.reporter.lastName}`
            : "Unknown",
          initials: ticket.reporter
            ? `${ticket.reporter.firstName?.[0] || ""}${ticket.reporter.lastName?.[0] || ""}`.toUpperCase()
            : "UN",
          time: formatTime(ticket.createdAt),
          preview: ticket.subject,
          unread: ticket.status === "OPEN",
          tag: "Support" as const,
          priority: ticket.priority || "MEDIUM",
          status: ticket.status,
          messages: [],
          threadType: "support" as const,
          ticketId: ticket.id,
        })
      );

      const flagConversations: Conversation[] = (flagsData.flags || []).map(
        (flag: any) => ({
          id: `flag-${flag.id}`,
          sender: flag.flagger
            ? `${flag.flagger.firstName} ${flag.flagger.lastName}`
            : "Unknown",
          initials: flag.flagger
            ? `${flag.flagger.firstName?.[0] || ""}${flag.flagger.lastName?.[0] || ""}`.toUpperCase()
            : "UN",
          time: formatTime(flag.createdAt),
          preview: flag.content,
          unread: flag.status === "PENDING",
          tag: "Flag" as const,
          priority: "HIGH",
          status: flag.status,
          messages: [],
          threadType: "flag" as const,
          flagId: flag.id,
        })
      );

      let allConversations = [...supportConversations, ...flagConversations];

      if (filter === "support") {
        allConversations = allConversations.filter((c) => c.threadType === "support");
      } else if (filter === "flags") {
        allConversations = allConversations.filter((c) => c.threadType === "flag");
      }

      // Sort by most recent
      allConversations.sort((a, b) => {
        const dateA = new Date(a.time === "Just now" ? Date.now() : a.time).getTime();
        const dateB = new Date(b.time === "Just now" ? Date.now() : b.time).getTime();
        return dateB - dateA;
      });

      setConversations(allConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationDetail = async (id: string, type: "support" | "flag") => {
    try {
      if (type === "support") {
        const ticketId = id.replace("support-", "");
        const response = await fetch(`/api/support/tickets/${ticketId}`);
        const data = await response.json();

        const messages: Message[] = (data.messages || []).map((msg: any) => ({
          id: msg.id,
          text: msg.message,
          from: msg.isFromAdmin ? "admin" : "user",
          sender: msg.sender
            ? `${msg.sender.firstName} ${msg.sender.lastName}`
            : "Unknown",
          time: formatTime(msg.createdAt),
        }));

        setConversations((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  messages,
                  preview: messages[messages.length - 1]?.text || c.preview,
                }
              : c
          )
        );
      } else {
        const flagId = id.replace("flag-", "");
        const response = await fetch(`/api/support/flags/${flagId}`);
        const data = await response.json();

        const flag = data.flag?.[0];

        if (flag) {
          const messages: Message[] = [
            {
              id: 0,
              text: flag.content,
              from: "user",
              sender: data.flag?.[0]?.reporter || "Unknown",
              time: formatTime(flag.createdAt),
            },
          ];

          setConversations((prev) =>
            prev.map((c) =>
              c.id === id
                ? {
                    ...c,
                    messages,
                    preview: flag.content,
                  }
                : c
            )
          );
        }
      }
    } catch (error) {
      console.error("Error fetching conversation detail:", error);
      toast({
        title: "Error",
        description: "Failed to load conversation",
        variant: "destructive",
      });
    }
  };

  const handleSelectConversation = (id: string, type: "support" | "flag") => {
    setSelectedId(id);
    fetchConversationDetail(id, type);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selected) return;

    const ticketId = selected.id.replace("support-", "");

    try {
      const response = await fetch(`/api/support/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageInput,
          isFromAdmin: true,
          senderId: 1, // Would come from auth in real app
        }),
      });

      if (response.ok) {
        const newMessage: Message = {
          id: Date.now(),
          text: messageInput,
          from: "admin",
          sender: "Admin",
          time: formatTime(new Date().toISOString()),
        };

        setConversations((prev) =>
          prev.map((m) =>
            m.id === selected.id
              ? { ...m, messages: [...m.messages, newMessage] }
              : m
          )
        );
        setMessageInput("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleMarkResolved = async () => {
    if (!selected) return;

    const ticketId = selected.id.replace("support-", "");

    try {
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CLOSED" }),
      });

      if (response.ok) {
        setConversations((prev) =>
          prev.map((m) => (m.id === selected.id ? { ...m, status: "CLOSED" } : m))
        );
        toast({
          title: "Success",
          description: "Ticket marked as resolved",
        });
      }
    } catch (error) {
      console.error("Error resolving ticket:", error);
      toast({
        title: "Error",
        description: "Failed to resolve ticket",
        variant: "destructive",
      });
    }
  };

  const handleResolveFlag = async () => {
    if (!selected) return;

    const flagId = selected.id.replace("flag-", "");

    try {
      const response = await fetch(`/api/support/flags/${flagId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RESOLVED" }),
      });

      if (response.ok) {
        setConversations((prev) =>
          prev.map((m) => (m.id === selected.id ? { ...m, status: "RESOLVED" } : m))
        );
        toast({
          title: "Success",
          description: "Flag resolved",
        });
      }
    } catch (error) {
      console.error("Error resolving flag:", error);
      toast({
        title: "Error",
        description: "Failed to resolve flag",
        variant: "destructive",
      });
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations;

  if (selected) {
    return (
      <div className="flex gap-6 h-[calc(100vh-7rem)]">
        {/* Chat area */}
        <div className="flex-1 bg-card rounded-xl border border-border flex flex-col">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <button
              type="button"
              aria-label="Go back"
              onClick={() => setSelectedId(null)}
              className="p-1 hover:bg-muted rounded"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
              {selected.initials}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{selected.sender}</p>
              <p className="text-xs text-muted-foreground">
                {selected.tag} • {selected.status}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                  selected.priority === "HIGH"
                    ? "bg-red-100 text-red-700"
                    : selected.priority === "MEDIUM"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {selected.priority}
              </span>
            </div>
          </div>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {selected.messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Loading messages...</p>
                </div>
              ) : (
                selected.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.from === "admin" ? "items-end" : "items-start"
                    } max-w-[75%] ${msg.from === "admin" ? "ml-auto" : ""}`}
                  >
                    <div
                      className={`p-4 rounded-2xl text-sm ${
                        msg.from === "admin"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {msg.sender} • {msg.time}
                    </p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border flex items-center gap-3">
            <button
              type="button"
              aria-label="Attach file"
              className="p-2 hover:bg-muted rounded-lg"
            >
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              type="button"
              aria-label="Add emoji"
              className="p-2 hover:bg-muted rounded-lg"
            >
              <Smile className="w-5 h-5 text-muted-foreground" />
            </button>
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button
              size="icon"
              className="bg-primary text-primary-foreground"
              onClick={handleSendMessage}
            >
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
            <p className="text-sm text-foreground leading-relaxed">
              {selected.messages[0]?.text || "Loading..."}
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground">Shared Files</h4>
              <button
                type="button"
                aria-label="View all files"
                className="text-xs text-primary font-medium"
              >
                View All
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary text-xs">📷</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Screenshot_1.png
                  </p>
                  <p className="text-xs text-muted-foreground">156 KB • Oct 14</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Download file"
                className="p-1"
              >
                <Download className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
          {selected.tag === "Support" && selected.status !== "CLOSED" && (
            <Button
              className="w-full bg-success hover:bg-success/90 text-success-foreground font-semibold"
              onClick={handleMarkResolved}
            >
              Mark as resolved
            </Button>
          )}
          {selected.tag === "Flag" && selected.status !== "RESOLVED" && (
            <div className="space-y-2">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                onClick={handleResolveFlag}
              >
                Resolve Flag
              </Button>
              <Button variant="outline" className="w-full">
                Dismiss Flag
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <div className="text-sm text-muted-foreground">
          {filteredConversations.filter((m) => m.unread).length} unread
        </div>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="bg-muted">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="support">Support Tickets</TabsTrigger>
          <TabsTrigger value="flags">Flags</TabsTrigger>
        </TabsList>
      </Tabs>

      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Loading conversations...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No messages found</p>
            </div>
          ) : (
            filteredConversations.map((msg) => (
              <button
                key={msg.id}
                onClick={() =>
                  handleSelectConversation(
                    msg.id,
                    msg.id.startsWith("support-") ? "support" : "flag"
                  )
                }
                className={`w-full bg-card rounded-xl border border-border p-5 flex items-start gap-4 hover:border-primary/30 transition-colors text-left ${
                  msg.unread ? "border-l-4 border-l-primary" : ""
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
                    {msg.initials}
                  </div>
                  {msg.unread && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{msg.sender}</p>
                    <p className="text-xs text-muted-foreground">{msg.time}</p>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {msg.preview}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
                        msg.tag === "Support"
                          ? "bg-accent text-accent-foreground"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {msg.tag}
                    </span>
                    <span
                      className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
                        msg.status === "OPEN" || msg.status === "PENDING"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
