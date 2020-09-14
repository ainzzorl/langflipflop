import React from "react";
import "./MyText.css";
import {
  IonButton,
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
} from "@ionic/react";

import { RouteComponentProps } from "react-router-dom";
import { arrowBackOutline } from "ionicons/icons";

interface MyTextProps
  extends RouteComponentProps<{
    id: string;
  }> {}

class MyText extends React.Component<
  MyTextProps,
  { lang: string; texts: any; sentenceIndex: number; title: String }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      lang: "en",
      texts: {},
      sentenceIndex: 0,
      title: "Durmstrang",
    };

    fetch("assets/data/texts/" + this.props.match.params.id + ".json")
      .then(res=>res.json())
      .then((res) => {
        this.setState((state) => ({
          texts: res
        }));
      });

    this.goToNext = this.goToNext.bind(this);
    this.goToPrevious = this.goToPrevious.bind(this);
  }

  goToNext() {
    this.setState((state) => ({
      lang: state.lang,
      texts: state.texts,
      sentenceIndex: state.sentenceIndex + 1,
    }));
  }

  goToPrevious() {
    this.setState((state) => ({
      lang: state.lang,
      texts: state.texts,
      sentenceIndex: state.sentenceIndex - 1,
    }));
  }

  render() {
    if (!this.state.texts['en']) {
      return <div>Loading...</div>;
    }
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton href="/mainmenu">
                <IonIcon slot="start" icon={arrowBackOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div>
            <h2>
              Sentence #{this.state.sentenceIndex + 1}/
              {this.state.texts["en"].sentences.length}
            </h2>
            <p
              onClick={() => {
                console.log("Old lang: " + this.state.lang);
                let newLang;
                if (this.state.lang === "en") {
                  newLang = "es";
                } else {
                  newLang = "en";
                }
                this.setState({
                  lang: newLang,
                  texts: this.state.texts,
                  sentenceIndex: this.state.sentenceIndex,
                });
              }}
            >
              {this.state.texts[this.state.lang].sentences[this.state.sentenceIndex]}
            </p>
            <IonButton
              disabled={this.state.sentenceIndex === 0}
              color="primary"
              onClick={this.goToPrevious}
            >
              {" "}
              Previous{" "}
            </IonButton>
            <IonButton
              disabled={
                this.state.sentenceIndex === this.state.texts["en"].sentences.length - 1
              }
              color="secondary"
              onClick={this.goToNext}
            >
              {" "}
              Next{" "}
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }
}

export default MyText;
