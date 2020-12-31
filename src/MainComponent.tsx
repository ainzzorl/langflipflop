import React from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import MyText from "./pages/MyText";
import LibraryMenu from "./pages/LibraryMenu";
import Recent from "./pages/Recent";

import { home, time } from "ionicons/icons";

const MainCompinent: React.FC = () => (
  <IonRouterOutlet>
    <Route exact path="/" render={() => <Redirect to="/tabs/library" />} />
    <Route path="/texts/:id" component={MyText} />
    <Route
      path="/tabs"
      render={() => {
        return (
          <IonTabs>
            <IonRouterOutlet>
              <Route
                path="/tabs/library"
                component={LibraryMenu}
                exact={true}
              />
              <Route path="/tabs/recent" component={Recent} exact={true} />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="library" href="/tabs/library">
                <IonIcon icon={home} />
                <IonLabel>Home</IonLabel>
              </IonTabButton>
              <IonTabButton tab="recent" href="/tabs/recent">
                <IonIcon icon={time} />
                <IonLabel>Recent</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        );
      }}
    />
  </IonRouterOutlet>
);

export default MainCompinent;
