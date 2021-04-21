import { isPlatform } from "@ionic/react";

export function isBrowser(): boolean {
  // isPlatform doesn't work in tests, so we just return True if in Jest context.
  return (
    process.env.JEST_WORKER_ID !== undefined ||
    isPlatform("desktop") ||
    isPlatform("mobileweb")
  );
}

export const BROWSER_CLICK_VERB = "click";
export const DEVICE_CLICK_VERB = "tap";