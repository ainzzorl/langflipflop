import React from "react";
import "./MyText.css";
import {
  IonButton,
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonIcon,
} from "@ionic/react";

import { RouteComponentProps } from "react-router-dom";
import { arrowBackOutline } from "ionicons/icons";

import TextMeta from "../common/TextMeta";

interface TextInfoProps
  extends RouteComponentProps<{
    id: string;
  }> {}

class TextInfoPage extends React.Component<
  TextInfoProps,
  {
    text: any;
    meta: TextMeta;
  }
> {
  constructor(props: any) {
    super(props);
    fetch("assets/data/texts/" + this.props.match.params.id + ".json")
      .then((res) => res.json())
      .then((res) => {
        this.setState(() => ({
          text: res,
          meta: new TextMeta(res),
        }));
      });
  }

  render() {
    if (!this.state?.text) {
      return (
        <IonPage>
          <IonContent></IonContent>
        </IonPage>
      );
    }
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton href={"/texts/" + this.props.match.params.id}>
                <IonIcon slot="start" icon={arrowBackOutline} />
              </IonButton>
              <IonTitle>{this.state.text["en"]["title"]}</IonTitle>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent class="ion-padding">
          <p>{this.state.text["en"]["description"]}</p>
          <p>Difficulty: {this.state.text.meta.difficulty}.</p>
          <p>Categories: {this.state.meta.prettyCategories()}.</p>
        </IonContent>
      </IonPage>
    );
  }
}

export default TextInfoPage;
