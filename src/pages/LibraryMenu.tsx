import React from "react";
import "./LibraryMenu.css";

import {
  IonContent,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";

class LibraryMenu extends React.Component<{}, {}> {
  render() {
    return (
      <IonContent>
        <IonCard button routerLink="/texts/louis-ck-01">
          <IonCardHeader>
            <IonCardTitle>
              <IonLabel>Louis CK - 01</IonLabel>
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <p>Difficulty: Foo</p>
            <p>Category: Bar</p>
            <p>Length: Car</p>
          </IonCardContent>
        </IonCard>

        <IonCard
          button
          routerLink="/texts/kaufmann-my-language-learning-technique"
        >
          <IonCardHeader>
            <IonCardTitle>
              <IonLabel>Kaufmann - My Language Learning Technique</IonLabel>
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <p>Difficulty: Foo</p>
            <p>Category: Bar</p>
            <p>Length: Car</p>
          </IonCardContent>
        </IonCard>

        <IonCard button routerLink="/texts/hufflepuff-common-room">
          <IonCardHeader>
            <IonCardTitle>
              <IonLabel>Hufflepuff Common Room</IonLabel>
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <p>Difficulty: Foo</p>
            <p>Category: Bar</p>
            <p>Length: Car</p>
          </IonCardContent>
        </IonCard>

        <IonCard button routerLink="/texts/owls">
          <IonCardHeader>
            <IonCardTitle>
              <IonLabel>Owls</IonLabel>
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <p>Difficulty: Foo</p>
            <p>Category: Bar</p>
            <p>Length: Car</p>
          </IonCardContent>
        </IonCard>

        <IonCard button routerLink="/texts/daily-prophet">
          <IonCardHeader>
            <IonCardTitle>
              <IonLabel>Daily Prophet</IonLabel>
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <p>Difficulty: Foo</p>
            <p>Category: Bar</p>
            <p>Length: Car</p>
          </IonCardContent>
        </IonCard>

        <IonCard button routerLink="/texts/every-country-has-ninjas">
          <IonCardHeader>
            <IonCardTitle>
              <IonLabel>Every Country Has Ninjas</IonLabel>
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <p>Difficulty: Foo</p>
            <p>Category: Bar</p>
            <p>Length: Car</p>
          </IonCardContent>
        </IonCard>

        <IonCard button routerLink="/texts/platform-9">
          <IonCardHeader>
            <IonCardTitle>
              <IonLabel>Platform 9 3/4</IonLabel>
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <p>Difficulty: Foo</p>
            <p>Category: Bar</p>
            <p>Length: Car</p>
          </IonCardContent>
        </IonCard>

        <IonCard button routerLink="/texts/funny-dialogs">
          <IonCardHeader>
            <IonCardTitle>
              <IonLabel>Funny Dialogs</IonLabel>
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <p>Difficulty: Foo</p>
            <p>Category: Bar</p>
            <p>Length: Car</p>
          </IonCardContent>
        </IonCard>
      </IonContent>
    );
  }
}

export default LibraryMenu;
