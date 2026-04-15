"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">CRE Tenant Finder</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to continue</p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              name="password"
              placeholder="Admin password"
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </main>
  );
}
