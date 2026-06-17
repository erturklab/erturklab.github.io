export const CONSENT_KEYS = {
  siteNotice: "erturk-site-notice-dismissed",
  youtube: "erturk-consent-youtube",
  googleMaps: "erturk-consent-google-maps",
} as const;

/** In development, consents reset on each page load so GDPR UI stays testable. */
export function shouldPersistConsent() {
  return process.env.NODE_ENV === "production";
}

export function readConsent(key: string) {
  if (!shouldPersistConsent()) return false;
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function writeConsent(key: string) {
  if (!shouldPersistConsent()) return;
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, "1");
  } catch {
    /* ignore */
  }
}

export function clearExternalContentConsent() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CONSENT_KEYS.youtube);
    localStorage.removeItem(CONSENT_KEYS.googleMaps);
    localStorage.removeItem(CONSENT_KEYS.siteNotice);
  } catch {
    /* ignore */
  }
  window.location.reload();
}

export function hasExternalContentConsent(provider: "youtube" | "google-maps") {
  const key = provider === "youtube" ? CONSENT_KEYS.youtube : CONSENT_KEYS.googleMaps;
  return readConsent(key);
}
