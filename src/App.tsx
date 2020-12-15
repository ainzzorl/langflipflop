import React from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

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
import MyLibrary from "./pages/MyLibrary";

import { home, bookmark } from "ionicons/icons";

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
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
                  <Route
                    path="/tabs/my-library"
                    component={MyLibrary}
                    exact={true}
                  />
                </IonRouterOutlet>
                <IonTabBar slot="bottom">
                  <IonTabButton tab="library" href="/tabs/library">
                    <IonIcon icon={home} />
                    <IonLabel>Home</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="my-library" href="/tabs/my-library">
                    <IonIcon icon={bookmark} />
                    <IonLabel>My Texts</IonLabel>
                  </IonTabButton>
                </IonTabBar>
              </IonTabs>
            );
          }}
        />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
