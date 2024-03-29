import {
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

class AboutPage extends React.Component<{}, {}> {
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
      <IonPage id="info-page">
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              <FormattedMessage id="about.header" />
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent id="info-page-content">
          <p className="content-text">
            <FormattedMessage id="about.p1" />
          </p>
          <p className="content-text">
            <FormattedMessage id="about.p2" />
          </p>
          <p className="content-text">
            <FormattedMessage id="about.p3" />
          </p>

          <p className="content-text">
            <a href={"http://reddit.com/r/langflipflop"}>
              <FormattedMessage id="text-info.discuss-on-reddit" />
            </a>
          </p>

          <p className="content-text">
            <a href={"https://langflipflop.medium.com/"}>
              <FormattedMessage id="about.read-out-blog" />
            </a>
          </p>

          {links}
        </IonContent>
      </IonPage>
    );
  }

  private getLinks() {
    return (
      <IonGrid>
        <IonRow className="ion-align-items-center store-links">
          <IonCol size="6">
            <a href={AboutPage.PLAYSTORE_LINK}>
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
        <IonRow>
          <IonCol size="12">
            <p className="content-text">
              <a href={AboutPage.CONTACT_LINK}>
                <FormattedMessage id="about.contact" />
              </a>
            </p>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  }
}

export default AboutPage;
