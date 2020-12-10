import React from "react";
import "./MainMenu.css";

import LibraryMenu from "./LibraryMenu";

import {
  IonPage,
  IonFooter,
  IonToolbar,
  IonIcon,
  IonButtons,
  IonButton,
  IonRow,
  IonCol,
  IonGrid,
} from "@ionic/react";

import { home, bookmark, settings } from "ionicons/icons";

class MainMenu extends React.Component<{}, {}> {
  render() {
    return (
      <IonPage>
        <LibraryMenu />

        <IonFooter>
          <IonToolbar>
            <IonButtons>
              <IonGrid>
                <IonRow>
                  <IonCol class="ion-text-center">
                    <div>
                      <IonButton fill="clear">
                        <IonIcon icon={home} size="large" />
                      </IonButton>
                      <br />
                      Home
                    </div>
                  </IonCol>
                  <IonCol class="ion-text-center">
                    <div>
                      <IonButton fill="clear">
                        <IonIcon icon={bookmark} size="large" />
                      </IonButton>
                      <br />
                      My Texts
                    </div>
                  </IonCol>
                  <IonCol class="ion-text-center">
                    <div>
                      <IonButton fill="clear">
                        <IonIcon icon={settings} size="large" />
                      </IonButton>
                      <br />
                      Settings
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonButtons>
          </IonToolbar>
        </IonFooter>
      </IonPage>
    );
  }
}

export default MainMenu;
