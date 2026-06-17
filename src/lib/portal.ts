import { createPortalClient, type PortalClient } from "@/lib/portal-client";

let client: PortalClient | null = null;

export function getPortalClient(): PortalClient | null {
  const siteId = process.env.PORTAL_SITE_ID;
  const publicKey = process.env.PORTAL_PUBLIC_KEY;
  if (!siteId || !publicKey) return null;

  if (!client) {
    client = createPortalClient({
      apiUrl: process.env.HIRE_AGENT_API_URL || "http://localhost:3000",
      siteId,
      publicKey,
      origin: process.env.PORTAL_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL,
    });
  }
  return client;
}

export function isPortalConfigured(): boolean {
  return !!(process.env.PORTAL_SITE_ID && process.env.PORTAL_PUBLIC_KEY);
}
