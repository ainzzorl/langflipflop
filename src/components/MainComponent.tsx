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
import "../theme/variables.css";
import TextPage from "../pages/TextPage";
import LibraryPage from "../pages/LibraryPage";
import RecentPage from "../pages/RecentPage";
import InfoPage from "../pages/InfoPage";
import SettingsPage from "../pages/SettingsPage";
import TextInfoPage from "../pages/TextInfoPage";

import { home, time, informationCircle, settings } from "ionicons/icons";
import FtuePage from "../pages/FtuePage";

import { DAO, User } from "../common/DAO";

class MainCompinent extends React.Component<{}, { user?: User }> {
  constructor(props: any) {
    super(props);
    this.state = { user: undefined };
    DAO.getUser().then((user) => this.setState({ user: user }));
  }

  render() {
    if (!this.state.user) {
      return <IonRouterOutlet></IonRouterOutlet>;
    }
    let mainRedirect = this.state.user!.completedFtue
      ? "/tabs/library"
      : "/ftue";
    return (
      <IonRouterOutlet>
        <Route exact path="/" render={() => <Redirect to={mainRedirect} />} />
        <Route path="/texts/:id" component={TextPage} />
        <Route path="/text-infos/:id" component={TextInfoPage} />
        <Route path="/ftue" component={FtuePage} />
        <Route
          path="/tabs"
          render={() => {
            return (
              <IonTabs>
                <IonRouterOutlet>
                  <Route
                    path="/tabs/library"
                    component={LibraryPage}
                    exact={true}
                  />
                  <Route
                    path="/tabs/recent"
                    component={RecentPage}
                    exact={true}
                  />
                  <Route
                    path="/tabs/settings"
                    component={SettingsPage}
                    exact={true}
                  />
                  <Route path="/tabs/info" component={InfoPage} exact={true} />
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
                  <IonTabButton tab="settings" href="/tabs/settings">
                    <IonIcon icon={settings} />
                    <IonLabel>Settings</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="info" href="/tabs/info">
                    <IonIcon icon={informationCircle} />
                    <IonLabel>Info</IonLabel>
                  </IonTabButton>
                </IonTabBar>
              </IonTabs>
            );
          }}
        />
      </IonRouterOutlet>
    );
  }
}

export default MainCompinent;
