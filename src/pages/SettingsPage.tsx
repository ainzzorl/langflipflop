import React from "react";
import "./Recent.css";

import { Plugins } from "@capacitor/core";
import { IonContent, IonPage } from "@ionic/react";

class SettingsPage extends React.Component<{}, {}> {
  render() {
    return (
      <IonPage>
        <IonContent>
          <div>Placeholder settings page</div>
        </IonContent>
      </IonPage>
    );
  }
}

export default SettingsPage;
