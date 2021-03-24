import React from "react";
import {
  IonBackButton,
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
} from "@ionic/react";

import { RouteComponentProps } from "react-router-dom";

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
              <IonBackButton
                defaultHref={"/texts/" + this.props.match.params.id}
              />
              <IonTitle>
                <div className="my-wrap">{this.state.text["en"]["title"]}</div>
              </IonTitle>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent class="ion-padding">
          <p>{this.state.text["en"]["description"]}</p>
          <p>Difficulty: {this.state.text.meta.difficulty}.</p>
          <p>Categories: {this.state.meta.prettyCategories()}.</p>
          {this.state.meta.sourceLink && this.state.meta.sourceText && (
            <p>
              Source:{" "}
              <a href={this.state.meta.sourceLink}>
                {this.state.meta.sourceText}
              </a>
              .
            </p>
          )}
        </IonContent>
      </IonPage>
    );
  }
}

export default TextInfoPage;
