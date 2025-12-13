"use client";

import { RegisterForm } from "@/entities/auth";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center px-4">
      <RegisterForm />
    </div>
  );
}