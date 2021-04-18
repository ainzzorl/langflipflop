import React from "react";
import {
  IonBackButton,
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonText,
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

  componentDidUpdate() {
    document.title = this.state.text["en"]["title"];
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
                defaultHref={`/texts/${this.props.match.params.id}${this.props.location.search}`}
              />
              <IonTitle color="medium">
                <div className="my-wrap">{this.state.text["en"]["title"]}</div>
              </IonTitle>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent class="ion-padding">
          <p>{this.state.text["en"]["description"]}</p>
          <p>
            <IonText color="medium">Difficulty: </IonText>
            <IonText>{this.state.text.meta.difficulty}</IonText>
          </p>
          <p>
            <IonText color="medium">Categories: </IonText>
            <IonText>{this.state.meta.prettyCategories()}</IonText>
          </p>
          {this.state.meta.sourceLink && this.state.meta.sourceText && (
            <p>
              <IonText color="medium">Source: </IonText>
              <a href={this.state.meta.sourceLink}>
                {this.state.meta.sourceText}
              </a>
            </p>
          )}
        </IonContent>
      </IonPage>
    );
  }
}

export default TextInfoPage;
