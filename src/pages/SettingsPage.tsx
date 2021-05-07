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
import { FormattedMessage } from "react-intl";
import { DAO, Settings } from "../common/DAO";

class SettingsPage extends React.Component<
  { reloadMainSettings: () => void },
  { settings?: Settings }
> {
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

  setInterfaceLanguage(interfaceLanguage: string) {
    this.state.settings!.interfaceLanguage = interfaceLanguage;
    this.onChange().then(() => {
      this.props.reloadMainSettings();
    });
  }

  setTheme(theme: string) {
    this.state.settings!.theme = theme;
    document.body.classList.toggle("dark", theme === "dark");
    this.onChange();
  }

  onChange() {
    return DAO.setSettings(this.state.settings!);
  }

  render() {
    if (!this.state.settings) {
      return <IonContent></IonContent>;
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              <FormattedMessage id="settings.header" />
            </IonTitle>
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
              value={this.state.settings.interfaceLanguage}
              onIonChange={(e) => this.setInterfaceLanguage(e.detail.value)}
              data-testid="select-interface-language"
            >
              <IonListHeader>
                <IonLabel>Interface Language</IonLabel>
              </IonListHeader>

              <IonItem>
                <IonLabel>English</IonLabel>
                <IonRadio slot="start" value="en" />
              </IonItem>

              <IonItem>
                <IonLabel>Español</IonLabel>
                <IonRadio slot="start" value="es" />
              </IonItem>

              <IonItem>
                <IonLabel>Русский</IonLabel>
                <IonRadio slot="start" value="ru" />
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
