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
import deepEqual from "fast-deep-equal/es6";
import { home, informationCircle, settings, time } from "ionicons/icons";
import React from "react";
import ReactGA from "react-ga";
import { FormattedMessage, IntlProvider } from "react-intl";
//@ts-ignore
import MetaTags from "react-meta-tags";
import { matchPath, Switch, withRouter } from "react-router";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import { getLocaleMessages, isLocalhost } from "../common/Common";
import { DAO, Settings, User } from "../common/DAO";
import English from "../lang/en.json";
import Spanish from "../lang/es.json";
import Russian from "../lang/ru.json";
import AboutPage from "../pages/AboutPage";
import FtuePage from "../pages/FtuePage";
import LandingPage from "../pages/LandingPage";
import LibraryPage from "../pages/LibraryPage";
import PageNotFoundPage from "../pages/PageNotFoundPage";
import RecentPage from "../pages/RecentPage";
import SettingsPage from "../pages/SettingsPage";
import TextInfoPage from "../pages/TextInfoPage";
import TextPage from "../pages/TextPage";
/* Theme variables */
import "../theme/variables.css";

const messages: any = {
  en: English,
  ru: Russian,
  es: Spanish,
};

class MainCompinent extends React.Component<
  RouteComponentProps<{}>,
  { user?: User; settings?: Settings }
> {
  constructor(props: any) {
    super(props);
    this.state = { user: undefined, settings: undefined };
    this.reloadSettings = this.reloadSettings.bind(this);
    DAO.getUser()
      .then((user) => {
        this.setState({ user: user });
        return DAO.getSettings();
      })
      .then((settings) => {
        this.setState({ settings: settings });
      });
  }

  componentDidUpdate() {
    let localeMessages = getLocaleMessages();
    if (matchPath(this.props.location.pathname, "/setup")) {
      document.title = localeMessages["document-title.ftue"];
    }
    if (matchPath(this.props.location.pathname, "/t/texts")) {
      document.title = localeMessages["document-title.texts"];
    }
    if (matchPath(this.props.location.pathname, "/t/recent")) {
      document.title = localeMessages["document-title.recent"];
    }
    if (matchPath(this.props.location.pathname, "/t/settings")) {
      document.title = localeMessages["document-title.settings"];
    }
    if (matchPath(this.props.location.pathname, "/t/about")) {
      document.title = localeMessages["document-title.about"];
    }
  }

  private shouldRedirectToFtue(): boolean {
    return this.shouldRedirectNewUser() && !this.shouldRedirectToLanding();
  }

  private shouldRedirectToLanding(): boolean {
    return (
      this.shouldRedirectNewUser() &&
      matchPath(this.props.location.pathname, { path: "/", exact: true }) !==
        null
    );
  }

  private shouldRedirectToTexts(): boolean {
    if (
      !this.state.user!.completedMainFtue &&
      !DAO.globalUser.completedMainFtue
    ) {
      return false;
    }
    return (
      matchPath(this.props.location.pathname, { path: "/", exact: true }) !==
      null
    );
  }

  private shouldRedirectNewUser(): boolean {
    if (
      this.state.user!.completedMainFtue ||
      DAO.globalUser.completedMainFtue
    ) {
      return false;
    }
    return (
      matchPath(this.props.location.pathname, "/t/recent") !== null ||
      matchPath(this.props.location.pathname, "/t/texts") !== null ||
      matchPath(this.props.location.pathname, { path: "/", exact: true }) !==
        null
    );
  }

  reloadSettings() {
    DAO.getSettings().then((settings) => {
      // Update state only if something actually changed,
      // otherwise it can get stuck updating itself indefinitely.
      if (!deepEqual(this.state.settings, settings)) {
        this.setState(() => ({
          settings: settings,
        }));
      }
    });
  }

  render() {
    if (!this.state.user || !this.state.settings) {
      return <IonRouterOutlet></IonRouterOutlet>;
    }

    if (!isLocalhost()) {
      ReactGA.initialize("UA-198267472-1");
      ReactGA.pageview(window.location.pathname + window.location.search);
    }

    if (this.shouldRedirectToTexts()) {
      return <Redirect to={"/t/texts"} />;
    }
    if (this.shouldRedirectToLanding()) {
      return <Redirect to={"/landing"} />;
    }
    if (this.shouldRedirectToFtue()) {
      let currentSearchParams = new URLSearchParams(this.props.location.search);
      let currentUrl = `${
        this.props.location.pathname
      }?${currentSearchParams.toString()}`;

      let ftueSearchParams = new URLSearchParams();
      ftueSearchParams.set("redirect", currentUrl);
      var ftueUrl = `/setup?${ftueSearchParams.toString()}`;
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

    let locale = this.state.settings.interfaceLanguage;
    (window as any).LOCALE_MESSAGES = messages[locale];

    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div>
          {metaTags}
          <IonRouterOutlet>
            <Switch>
              {/* Any non-redirectable target will do - it will be redirected somewhere anyway. */}
              <Route path="/" component={AboutPage} exact={true} />

              <Route
                path="/texts/:id/info"
                component={TextInfoPage}
                exact={true}
              />
              <Route path="/texts/:id" component={TextPage} exact={true} />
              <Route
                path="/setup"
                render={(props) => (
                  <FtuePage
                    {...props}
                    reloadMainSettings={this.reloadSettings}
                  />
                )}
              />
              <Route path="/landing" component={LandingPage} exact={true} />
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
                          exact={true}
                          render={(props) => (
                            <SettingsPage
                              {...props}
                              reloadMainSettings={this.reloadSettings}
                            />
                          )}
                        />
                        <Route
                          path="/t/about"
                          component={AboutPage}
                          exact={true}
                        />
                      </IonRouterOutlet>
                      <IonTabBar slot="bottom">
                        <IonTabButton tab="library" href="/t/texts">
                          <IonIcon icon={home} />
                          <IonLabel>
                            <FormattedMessage id="tab.library" />
                          </IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="recent" href="/t/recent">
                          <IonIcon icon={time} />
                          <IonLabel>
                            <FormattedMessage id="tab.recent" />
                          </IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="settings" href="/t/settings">
                          <IonIcon icon={settings} />
                          <IonLabel>
                            <FormattedMessage id="tab.settings" />
                          </IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="about" href="/t/about">
                          <IonIcon icon={informationCircle} />
                          <IonLabel>
                            <FormattedMessage id="tab.about" />
                          </IonLabel>
                        </IonTabButton>
                      </IonTabBar>
                    </IonTabs>
                  );
                }}
              />
              <Route
                path="/404.html"
                exact={true}
                component={PageNotFoundPage}
              />
              <Redirect to="/404.html" />
            </Switch>
          </IonRouterOutlet>
        </div>
      </IntlProvider>
    );
  }
}

export default withRouter(MainCompinent);
