import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonLabel,
} from "@ionic/react";
import React from "react";
import { FormattedMessage } from "react-intl";
import { PersistentTextData, Settings } from "../common/DAO";
import TextMeta from "../common/TextMeta";

class TextCard extends React.Component<
  {
    textMeta: TextMeta;
    persistentData: PersistentTextData;
    settings: Settings;
  },
  {}
> {
  render() {
    let directionParts = this.props.settings.translationDirection.split("-");
    let lang1 = directionParts[0];
    let lang2 = directionParts[1];
    let index = this.props.persistentData.currentIndex + 1;
    let routerLink = `/texts/${this.props.textMeta.id}?lang1=${lang1}&lang2=${lang2}&i=${index}`;
    let lengthStr = this.props.textMeta.numSegments.toString();
    if (this.props.persistentData.maxOpenedIndex !== undefined) {
      let percent = Math.ceil(
        (100 * (this.props.persistentData.maxOpenedIndex + 1)) /
          this.props.textMeta.numSegments
      );
      lengthStr += ` (Read: ${percent}%)`; // TODO: internationalize
    }

    return (
      <IonCard button routerLink={routerLink}>
        <IonCardHeader>
          <IonCardTitle>
            <IonLabel>{this.props.textMeta.title}</IonLabel>
          </IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
          <p>
            <FormattedMessage id="text-card.difficulty" />
            <FormattedMessage
              id={`difficulty.${this.props.textMeta.difficulty}`}
            />
          </p>
          <p>
            <FormattedMessage id="text-card.categories" />
            {this.props.textMeta.prettyCategories()}
          </p>
          <p>
            <FormattedMessage id="text-card.length" /> {lengthStr}
          </p>
        </IonCardContent>
      </IonCard>
    );
  }
}

export default TextCard;
