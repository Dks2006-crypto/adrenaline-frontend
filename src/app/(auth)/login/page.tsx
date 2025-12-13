"use client";

import { LoginForm } from "@/entities/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}