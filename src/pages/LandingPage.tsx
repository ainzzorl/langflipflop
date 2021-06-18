import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { FormattedMessage } from "react-intl";
import { isBrowser } from "../common/Common";
import "./AboutPage.css";

class LandingPage extends React.Component<{}, {}> {
  static readonly PLAYSTORE_LINK =
    "https://play.google.com/store/apps/details?id=com.langflipflop";
  static readonly CONTACT_LINK = "mailto:langflipflop@gmail.com";

  render() {
    let links;
    if (isBrowser()) {
      links = this.getLinks();
    } else {
      links = <div />;
    }
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              <FormattedMessage id="landing.header" />
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent id="info-page-content">
          <p className="content-text">
            <b>LangFlipFlop</b> - <FormattedMessage id="landing.definition" />
          </p>
          <ol>
            <li>
              <FormattedMessage id="landing.bullet-1" />
            </li>
            <li>
              <FormattedMessage id="landing.bullet-2" />
            </li>
            <li>
              <FormattedMessage id="landing.bullet-3" />
            </li>
          </ol>

          <p className="content-text">
            <IonButton size="large" href="/setup">
              <FormattedMessage id="landing.get-started" />
            </IonButton>
          </p>

          {links}
        </IonContent>
      </IonPage>
    );
  }

  private getLinks() {
    return (
      <div>
        <p className="content-text">
          <FormattedMessage id="landing.download-our-app" />
        </p>
        <IonGrid>
          <IonRow className="ion-align-items-center store-links">
            <IonCol size="6">
              <a href={LandingPage.PLAYSTORE_LINK}>
                <img
                  alt="Get it on Google Play"
                  src="assets/google-play-badge.png"
                />
              </a>
            </IonCol>
            <IonCol col-6>
              <FormattedMessage id="about.coming-soon-on-apple" />
            </IonCol>
          </IonRow>
        </IonGrid>
      </div>
    );
  }
}

export default LandingPage;
