import React from "react";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";

import { matchPath, withRouter } from "react-router";

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

class MainCompinent extends React.Component<
  RouteComponentProps<{}>,
  { user?: User }
> {
  constructor(props: any) {
    super(props);
    this.state = { user: undefined };
    DAO.getUser().then((user) => this.setState({ user: user }));
  }

  componentDidUpdate() {
    if (matchPath(this.props.location.pathname, "/ftue")) {
      document.title = "Setup";
    }
    if (matchPath(this.props.location.pathname, "/t/texts")) {
      document.title = "Home";
    }
    if (matchPath(this.props.location.pathname, "/t/recent")) {
      document.title = "Recent";
    }
    if (matchPath(this.props.location.pathname, "/t/settings")) {
      document.title = "Settings";
    }
    if (matchPath(this.props.location.pathname, "/t/about")) {
      document.title = "About";
    }
  }

  render() {
    if (!this.state.user) {
      return <IonRouterOutlet></IonRouterOutlet>;
    }
    if (
      !this.state.user!.completedMainFtue &&
      !DAO.globalUser.completedMainFtue &&
      !matchPath(this.props.location.pathname, "/ftue")
    ) {
      let currentSearchParams = new URLSearchParams(this.props.location.search);
      let currentUrl = `${
        this.props.location.pathname
      }?${currentSearchParams.toString()}`;

      let ftueSearchParams = new URLSearchParams();
      ftueSearchParams.set("redirect", currentUrl);
      var ftueUrl = `/ftue?${ftueSearchParams.toString()}`;
      return <Redirect to={ftueUrl} />;
    }

    return (
      <IonRouterOutlet>
        <Route exact path="/" render={() => <Redirect to={"/t/texts"} />} />
        <Route path="/texts/:id/info" component={TextInfoPage} exact={true} />
        <Route path="/texts/:id" component={TextPage} exact={true} />
        <Route path="/ftue" component={FtuePage} />
        <Route
          path="/t"
          render={() => {
            return (
              <IonTabs>
                <IonRouterOutlet>
                  <Route path="/t/texts" component={LibraryPage} exact={true} />
                  <Route path="/t/recent" component={RecentPage} exact={true} />
                  <Route
                    path="/t/settings"
                    component={SettingsPage}
                    exact={true}
                  />
                  <Route path="/t/about" component={InfoPage} exact={true} />
                </IonRouterOutlet>
                <IonTabBar slot="bottom">
                  <IonTabButton tab="library" href="/t/texts">
                    <IonIcon icon={home} />
                    <IonLabel>Home</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="recent" href="/t/recent">
                    <IonIcon icon={time} />
                    <IonLabel>Recent</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="settings" href="/t/settings">
                    <IonIcon icon={settings} />
                    <IonLabel>Settings</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="about" href="/t/about">
                    <IonIcon icon={informationCircle} />
                    <IonLabel>About</IonLabel>
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

export default withRouter(MainCompinent);
