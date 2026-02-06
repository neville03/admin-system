import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const { token } = await api.auth.login(email, password);
      // localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_token", "demo-token");
      navigate("/dashboard");
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-sm border border-border p-8 space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl">🎆</span>
            <span className="text-2xl font-bold text-foreground">Event Bridge</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Hello Admin,</h1>
          <p className="text-muted-foreground text-sm">
            Enter your credentials to access the dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. admin@marketplace.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="keep"
              checked={keepLoggedIn}
              onCheckedChange={(v) => setKeepLoggedIn(v as boolean)}
            />
            <Label htmlFor="keep" className="text-sm text-muted-foreground cursor-pointer">
              Keep me logged in
            </Label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        © 2026 EventBridge Admin System. All rights reserved.
      </p>
    </div>
  );
}
