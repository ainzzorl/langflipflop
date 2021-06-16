import { isPlatform } from "@ionic/react";
import queryString from "query-string";
import TextMeta from "./TextMeta";

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

export async function loadAllTextMetadata(): Promise<Array<TextMeta>> {
  return fetch("assets/data/texts.json")
    .then((res) => res.json())
    .then((res) => {
      let textDatas: Array<any> = res["texts"];
      return textDatas.map((data) => {
        return new TextMeta(data);
      });
    });
}

export function getLocaleMessages(): any {
  return window.hasOwnProperty("LOCALE_MESSAGES")
    ? (window as any).LOCALE_MESSAGES
    : {};
}

export function isLocalhost(): boolean {
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}

export const BROWSER_CLICK_VERB = "click";
export const DEVICE_CLICK_VERB = "tap";
