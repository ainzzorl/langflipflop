import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonToolbar,
} from "@ionic/react";
import queryString from "query-string";
import React from "react";
import { RouteComponentProps, StaticContext, withRouter } from "react-router";
import { DAO, Settings, User } from "../common/DAO";
import "./FtuePage.css";

class FtuePage extends React.Component<
  RouteComponentProps<any, StaticContext, unknown>,
  { settings: Settings; redirect: string }
> {
  constructor(props: any) {
    super(props);
    this.completeFtue = this.completeFtue.bind(this);

    let queryParams = queryString.parse(this.props.location.search);

    this.state = {
      settings: new Settings(),
      redirect: (queryParams["redirect"] as string) || "/t/texts",
    };
  }

  setTranslationDirection(translationDirection: string) {
    this.setState(
      (state) => {
        state.settings.translationDirection = translationDirection;
        return { settings: state.settings };
      },
      () => {
        DAO.setSettings(this.state.settings);
      }
    );
  }

  completeFtue() {
    let user = new User();
    user.completedMainFtue = true;
    this.setTranslationDirection(this.state.settings.translationDirection);
    DAO.setUser(user).then(() => {
      this.props.history.push(this.state.redirect);
    });
  }

  render() {
    return (
      <IonPage id="ftue-page">
        <IonHeader>
          <IonToolbar>
            <IonHeader>Setup</IonHeader>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonRadioGroup
              value={this.state.settings.translationDirection}
              onIonChange={(e) => this.setTranslationDirection(e.detail.value)}
            >
              <IonListHeader>
                <IonLabel>
                  Please select the translation you'd like to practice.
                </IonLabel>
              </IonListHeader>

              <IonItem>
                <IonLabel>English &#8594; Spanish</IonLabel>
                <IonRadio slot="start" value="en-es" />
              </IonItem>

              <IonItem>
                <IonLabel>Spanish &#8594; English</IonLabel>
                <IonRadio slot="start" value="es-en" />
              </IonItem>
            </IonRadioGroup>
          </IonList>
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton color="primary" onClick={this.completeFtue}>
                Start
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonFooter>
      </IonPage>
    );
  }
}

export default withRouter(FtuePage);
