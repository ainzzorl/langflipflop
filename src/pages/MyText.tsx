import React from "react";
import "./MyText.css";
import { throws } from "assert";

import { IonButton, IonIcon, IonContent, IonPage } from "@ionic/react";

import { RouteComponentProps } from "react-router-dom";

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
    console.log("### MyProps: ");
    console.log(this.props);
    this.state = {
      lang: "en",
      texts: {},
      sentenceIndex: 0,
      title: "Durmstrang",
    };

    function toSentences(text: string) {
      return text.split("\n").filter((s) => s.length > 0);
    }

    fetch("assets/data/texts/" + this.props.match.params.id + "/en.txt")
      .then(function (response) {
        return response.text();
      })
      .then((res) => {
        console.log("### Read texts en");
        this.setState((state) => {
          let nt = this.state.texts;
          nt["en"] = toSentences(res);
          return nt;
        });
      });

    fetch("assets/data/texts/" + this.props.match.params.id + "/es.txt")
      .then(function (response) {
        return response.text();
      })
      .then((res) => {
        console.log("### Read texts es");
        this.setState((state) => {
          let nt = this.state.texts;
          nt["es"] = toSentences(res);
          return nt;
        });
      });

    this.goToNext = this.goToNext.bind(this);
    this.goToPrevious = this.goToPrevious.bind(this);
  }

  goToNext() {
    console.log("### Going to next!");
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
    if (!this.state.texts["en"] || !this.state.texts["es"]) {
      return <div>Loading...</div>;
    }
    if (this.state.texts["en"].length !== this.state.texts["es"].length) {
      return (
        <div>
          Texts length mismatch! en={this.state.texts["en"].length} vs es=
          {this.state.texts["es"].length}
        </div>
      );
    }
    return (
      <IonPage>
        <IonContent>
          <div>
            <h2>
              Sentence #{this.state.sentenceIndex + 1}/
              {this.state.texts["en"].length}
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
              {this.state.texts[this.state.lang][this.state.sentenceIndex]}
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
                this.state.sentenceIndex === this.state.texts["en"].length - 1
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
