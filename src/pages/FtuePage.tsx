import React from "react";
import "./LibraryPage.css";

import {
  IonContent,
  IonLabel,
  IonPage,
  IonList,
  IonItem,
  IonHeader,
  IonToolbar,
  IonRadioGroup,
  IonRadio,
  IonListHeader,
  IonFooter,
  IonButton,
  IonButtons,
} from "@ionic/react";
import { DAO, Settings, User } from "../common/DAO";

import { RouteComponentProps, StaticContext, withRouter } from "react-router";

class FtuePage extends React.Component<
  RouteComponentProps<any, StaticContext, unknown>,
  { settings: Settings }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      settings: new Settings(),
    };
    this.completeFtue = this.completeFtue.bind(this);
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
    user.completedFtue = true;
    this.setTranslationDirection(this.state.settings.translationDirection);
    DAO.setUser(user).then(() => {
      this.props.history.push("/tabs/library");
    });
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonHeader>Welcome</IonHeader>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <p>Welcome to our App.</p>
          <p>Use it so and so.</p>

          <IonList>
            <IonRadioGroup
              value={this.state.settings.translationDirection}
              onIonChange={(e) => this.setTranslationDirection(e.detail.value)}
            >
              <IonListHeader>
                <IonLabel>
                  Please select the translation you want to practice.
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
                Let's go
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonFooter>
      </IonPage>
    );
  }
}

export default withRouter(FtuePage);