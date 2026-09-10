"use client";

import { useContext } from "react";
import { SessionContext } from "../contexts/SessionContext";

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used inside SessionProvider");
  }
  return context;
}
