import React from "react";
import {
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";

import TextMeta from "../common/TextMeta";

class TextCard extends React.Component<{ textMeta: TextMeta }, {}> {
  render() {
    let routerLink = "/texts/" + this.props.textMeta.id;
    return (
      <IonCard button routerLink={routerLink}>
        <IonCardHeader>
          <IonCardTitle>
            <IonLabel>{this.props.textMeta.title}</IonLabel>
          </IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
          <p>Difficulty: {this.props.textMeta.difficulty}</p>
          <p>Categories: {this.props.textMeta.prettyCategories()}</p>
          <p>Length: {this.props.textMeta.numSentences}</p>
        </IonCardContent>
      </IonCard>
    );
  }
}

export default TextCard;
