import { isPlatform } from "@ionic/react";
import queryString from "query-string";

export function isBrowser(): boolean {
  // isPlatform doesn't work in tests, so we just return True if in Jest context.
  return (
    process.env.JEST_WORKER_ID !== undefined ||
    isPlatform("desktop") ||
    isPlatform("mobileweb")
  );
}

export function getSearch(props: any) {
  if (props) {
    return props.location.search;
  } else {
    return window.location.search;
  }
}

export function getQueryParams(props: any) {
  return queryString.parse(getSearch(props));
}

export const BROWSER_CLICK_VERB = "click";
export const DEVICE_CLICK_VERB = "tap";
