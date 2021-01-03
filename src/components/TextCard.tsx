import React from "react";
import {
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";

import TextMeta from "../common/TextMeta";
import { PersistentTextData } from "../common/DAO";

class TextCard extends React.Component<
  { textMeta: TextMeta; persistentData: PersistentTextData },
  {}
> {
  render() {
    let routerLink = "/texts/" + this.props.textMeta.id;
    let lengthStr = this.props.textMeta.numSentences.toString();
    if (this.props.persistentData.maxOpenedIndex !== undefined) {
      let percent = Math.ceil(
        (100 * (this.props.persistentData.maxOpenedIndex + 1)) /
          this.props.textMeta.numSentences
      );
      lengthStr += ` (Read: ${percent}%)`;
    }

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
          <p>Length: {lengthStr}</p>
        </IonCardContent>
      </IonCard>
    );
  }
}

export default TextCard;
