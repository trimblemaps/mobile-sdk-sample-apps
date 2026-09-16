import { createContext, useContext } from "react";

export const TrimbleApiKeyContext = createContext("");

export function useTrimbleApiKey(): string {
  return useContext(TrimbleApiKeyContext);
}
