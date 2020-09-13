import React from 'react';
import './MainMenu.css';

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonMenu, IonLabel, IonItem, IonList, IonRouterOutlet, IonButtons, IonButton, IonListHeader, IonMenuToggle } from '@ionic/react';

class MainMenu extends React.Component<{}, {}> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <IonPage>
        <IonContent>
            <IonList>
              <IonItem routerLink="/text/hufflepuff-common-room">
                <IonLabel>Hufflepuff Common Room</IonLabel>
              </IonItem>
              <IonItem routerLink="/text/some-other-stuff">
                <IonLabel>Some Other Stuff</IonLabel>
              </IonItem>
            </IonList>
    </IonContent>
    </IonPage>
);
    }
}

export default MainMenu;
