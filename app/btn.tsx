"use client";

import { signIn } from "@/lib/auth-client";
export default function Button() {
  return (
    <button onClick={() => signIn.social({ provider: "google" })}>
      Button
    </button>
  );
}
