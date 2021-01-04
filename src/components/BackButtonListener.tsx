import React, { useEffect } from "react";
import { Plugins } from "@capacitor/core";
import { useIonRouter } from "@ionic/react";
const { App } = Plugins;

interface BackButtonListenerProps {}

const BackButtonListener: React.FC<BackButtonListenerProps> = (props) => {
  const router = useIonRouter();

  useEffect(() => {
    document.addEventListener("ionBackButton", (ev: any) => {
      ev.detail.register(-1, (next: any) => {
        if (
          !router.canGoBack() &&
          (window.location.pathname === "/" ||
            window.location.pathname === "/tabs/library")
        ) {
          App.exitApp();
        }
      });
    });
    // eslint-disable-next-line
  }, []);
  return <>{props.children}</>;
};

export default BackButtonListener;
