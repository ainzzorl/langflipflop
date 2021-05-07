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
import { FormattedMessage } from "react-intl";
import { RouteComponentProps, StaticContext, withRouter } from "react-router";
import { DAO, Settings, User } from "../common/DAO";
import "./FtuePage.css";

interface FtueProps extends RouteComponentProps<any, StaticContext, unknown> {
  reloadMainSettings: () => void;
}

class FtuePage extends React.Component<
  FtueProps,
  { settings?: Settings; redirect: string }
> {
  static readonly DEFAULT_REDIRECT = "/t/texts";

  constructor(props: any) {
    super(props);
    this.completeFtue = this.completeFtue.bind(this);

    let queryParams = queryString.parse(this.props.location.search);

    this.state = {
      settings: undefined,
      redirect:
        (queryParams["redirect"] as string) || FtuePage.DEFAULT_REDIRECT,
    };
    DAO.getSettings().then((settings) => {
      this.setState(() => ({
        settings: settings,
      }));
    });
  }

  private completeFtue() {
    let user = new User();
    user.completedMainFtue = true;
    this.setTranslationDirection(this.state.settings!.translationDirection);
    DAO.setUser(user).then(() => {
      this.props.history.push(this.state.redirect);
    });
  }

  private setTranslationDirection(translationDirection: string) {
    this.setState(
      (state) => {
        state.settings!.translationDirection = translationDirection;
        return { settings: state.settings };
      },
      () => {
        DAO.setSettings(this.state.settings!);
      }
    );
  }

  setInterfaceLanguage(interfaceLanguage: string) {
    this.setState(
      (state) => {
        state.settings!.interfaceLanguage = interfaceLanguage;
        return { settings: state.settings };
      },
      () => {
        DAO.setSettings(this.state.settings!).then(() => {
          this.props.reloadMainSettings();
        });
      }
    );
  }

  render() {
    if (!this.state.settings) {
      return <IonContent></IonContent>;
    }
    return (
      <IonPage id="ftue-page">
        <IonHeader>
          <IonToolbar>
            <IonHeader>
              <FormattedMessage id="ftue.header" />
            </IonHeader>
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
                  <FormattedMessage id="ftue.select-translation-direction" />
                </IonLabel>
              </IonListHeader>

              <IonItem>
                <IonLabel>
                  <FormattedMessage id="ftue.english-spanish" />
                </IonLabel>
                <IonRadio slot="start" value="en-es" />
              </IonItem>

              <IonItem>
                <IonLabel>
                  <FormattedMessage id="ftue.spanish-english" />
                </IonLabel>
                <IonRadio slot="start" value="es-en" />
              </IonItem>
            </IonRadioGroup>

            <IonRadioGroup
              value={this.state.settings.interfaceLanguage}
              onIonChange={(e) => this.setInterfaceLanguage(e.detail.value)}
              data-testid="select-interface-language"
            >
              <IonListHeader>
                <IonLabel>
                  <FormattedMessage id="ftue.interface-language" />
                </IonLabel>
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
          </IonList>
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton color="primary" onClick={this.completeFtue}>
                <FormattedMessage id="ftue.start" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonFooter>
      </IonPage>
    );
  }
}

export default withRouter(FtuePage);
