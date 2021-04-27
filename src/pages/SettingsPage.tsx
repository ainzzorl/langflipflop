import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { DAO, Settings } from "../common/DAO";

class SettingsPage extends React.Component<{}, { settings?: Settings }> {
  constructor(props: any) {
    super(props);
    this.state = {
      settings: undefined,
    };
    DAO.getSettings().then((settings) => {
      this.setState(() => ({
        settings: settings,
      }));
    });

    this.onChange = this.onChange.bind(this);
  }

  setTranslationDirection(translationDirection: string) {
    this.state.settings!.translationDirection = translationDirection;
    this.onChange();
  }

  setTheme(theme: string) {
    this.state.settings!.theme = theme;
    document.body.classList.toggle("dark", theme === "dark");
    this.onChange();
  }

  onChange() {
    DAO.setSettings(this.state.settings!);
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
              onIonChange={(e) => this.setTranslationDirection(e.detail.value)}
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
            <IonRadioGroup
              value={this.state.settings.theme}
              onIonChange={(e) => this.setTheme(e.detail.value)}
            >
              <IonListHeader>
                <IonLabel>Theme</IonLabel>
              </IonListHeader>

              <IonItem>
                <IonLabel>Light</IonLabel>
                <IonRadio slot="start" value="light" />
              </IonItem>

              <IonItem>
                <IonLabel>Dark</IonLabel>
                <IonRadio slot="start" value="dark" />
              </IonItem>
            </IonRadioGroup>
          </IonList>
        </IonContent>
      </IonPage>
    );
  }
}

export default SettingsPage;
