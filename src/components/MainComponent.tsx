import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/typography.css";
import { home, informationCircle, settings, time } from "ionicons/icons";
import React from "react";
//@ts-ignore
import MetaTags from "react-meta-tags";
import { matchPath, withRouter } from "react-router";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import { DAO, User } from "../common/DAO";
import FtuePage from "../pages/FtuePage";
import InfoPage from "../pages/InfoPage";
import LibraryPage from "../pages/LibraryPage";
import RecentPage from "../pages/RecentPage";
import SettingsPage from "../pages/SettingsPage";
import TextInfoPage from "../pages/TextInfoPage";
import TextPage from "../pages/TextPage";
/* Theme variables */
import "../theme/variables.css";

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

  shouldRedirectToFtue(): boolean {
    if (
      this.state.user!.completedMainFtue ||
      DAO.globalUser.completedMainFtue
    ) {
      return false;
    }
    if (matchPath(this.props.location.pathname, "/ftue")) {
      return false;
    }
    // To make it indexable by search engines.
    if (matchPath(this.props.location.pathname, "/t/about")) {
      return false;
    }
    return true;
  }

  render() {
    if (!this.state.user) {
      return <IonRouterOutlet></IonRouterOutlet>;
    }
    if (this.shouldRedirectToFtue()) {
      let currentSearchParams = new URLSearchParams(this.props.location.search);
      let currentUrl = `${
        this.props.location.pathname
      }?${currentSearchParams.toString()}`;

      let ftueSearchParams = new URLSearchParams();
      ftueSearchParams.set("redirect", currentUrl);
      var ftueUrl = `/ftue?${ftueSearchParams.toString()}`;
      return <Redirect to={ftueUrl} />;
    }

    // Hide alpha and anything else besides prod from search engines.
    let shouldNoIndex =
      window.location.hostname !== "langflipflop.com" &&
      window.location.hostname !== "www.langflipflop.com";
    let metaTags = null;
    if (shouldNoIndex) {
      metaTags = (
        <MetaTags>
          <meta property="robots" content="noindex" />
        </MetaTags>
      );
    }

    return (
      <div>
        {metaTags}
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
                    <Route
                      path="/t/texts"
                      component={LibraryPage}
                      exact={true}
                    />
                    <Route
                      path="/t/recent"
                      component={RecentPage}
                      exact={true}
                    />
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
      </div>
    );
  }
}

export default withRouter(MainCompinent);
