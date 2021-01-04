import React from "react";
import "./Recent.css";

import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonRadioGroup,
  IonRadio,
  IonListHeader,
  IonLabel,
  IonItem,
} from "@ionic/react";
import { DAO, Settings } from "../common/DAO";

class SettingsPage extends React.Component<
  {},
  { settings?: Settings; isUpdating: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      settings: undefined,
      isUpdating: true,
    };
    DAO.getSettings().then((settings) => {
      this.setState(() => ({
        settings: settings,
        isUpdating: false,
      }));
    });

    this.onChange = this.onChange.bind(this);
  }

  onChange(translationDirection: string) {
    this.state.settings!.translationDirection = translationDirection;
    this.setState(
      () => ({
        isUpdating: true,
      }),
      () => {
        DAO.setSettings(this.state.settings!).then(() =>
          this.setState(() => ({
            isUpdating: false,
          }))
        );
      }
    );
  }

  render() {
    if (!this.state.settings) {
      return <IonContent></IonContent>;
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonRadioGroup
              value={this.state.settings.translationDirection}
              onIonChange={(e) => this.onChange(e.detail.value)}
            >
              <IonListHeader>
                <IonLabel>Languages</IonLabel>
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
          {!this.state.isUpdating && <div data-testid="ready-indicator"></div>}
        </IonContent>
      </IonPage>
    );
  }
}

export default SettingsPage;
