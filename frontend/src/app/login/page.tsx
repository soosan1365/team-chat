"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/src/hooks/auth/useLogin";

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      await loginMutation.mutateAsync({
        email,
        password,
      });
      setEmail("");
      setPassword("");
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B0D12] px-4 py-10 text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-violet-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-violet-600/10 blur-[100px]" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-300 to-cyan-500 shadow-lg shadow-teal-500/20 transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105 sm:h-10 sm:w-10">
            <MessageCircle className="h-5 w-5 text-[#0D1726]" />
          </div>
          <h1 className="text-base font-bold tracking-tight text-slate-100 sm:text-lg">
            Team<span className="text-teal-300">Flow</span>
          </h1>
        </div>
        <section className="rounded-2xl border border-white/10 bg-[#11131B]/95 p-7 shadow-2xl shadow-black/30 sm:p-9">
          <div className="mb-8 space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm leading-6 text-gray-400">
              Sign in to continue your conversations with your team.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="h-11 border-white/10 bg-[#0B0D12] pl-10 text-white placeholder:text-gray-600 focus-visible:ring-violet-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="h-11 border-white/10 bg-[#0B0D12] pl-10 text-white placeholder:text-gray-600 focus-visible:ring-violet-500"
                />
              </div>
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
              >
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="h-11 w-full bg-teal-600 font-medium text-white hover:bg-violet-500"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-7 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-violet-400 transition-colors hover:text-violet-300"
              >
                Create account
              </Link>
            </p>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-gray-600">
          Your team conversations, all in one place.
        </p>
      </div>
    </main>
  );
}
