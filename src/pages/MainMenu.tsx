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
import MyLibrary from "./MyLibrary";

class MainMenu extends React.Component<{}, { subview: string }> {
  constructor(props: any) {
    super(props);
    this.state = {
      subview: "library",
    };
  }

  render() {
    return (
      <IonPage>
        {this.state.subview === "library" && <LibraryMenu />}

        {this.state.subview === "my-library" && <MyLibrary />}

        <IonFooter>
          <IonToolbar>
            <IonButtons>
              <IonGrid>
                <IonRow>
                  <IonCol class="ion-text-center">
                    <div>
                      <IonButton
                        fill="clear"
                        onClick={() => {
                          this.setState({
                            subview: "library",
                          });
                        }}
                      >
                        <IonIcon icon={home} size="large" />
                      </IonButton>
                      <br />
                      Home
                    </div>
                  </IonCol>
                  <IonCol class="ion-text-center">
                    <div>
                      <IonButton
                        fill="clear"
                        onClick={() => {
                          this.setState({
                            subview: "my-library",
                          });
                        }}
                      >
                        <IonIcon icon={bookmark} size="large" />
                      </IonButton>
                      <br />
                      My Texts
                    </div>
                  </IonCol>
                  <IonCol class="ion-text-center">
                    <div>
                      <IonButton
                        fill="clear"
                        onClick={() => {
                          this.setState({
                            subview: "settings",
                          });
                        }}
                      >
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
