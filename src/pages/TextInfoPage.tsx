import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { FormattedMessage } from "react-intl";
import { RouteComponentProps } from "react-router-dom";
import { getQueryParams } from "../common/Common";
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
    lang1: string;
  }
> {
  constructor(props: any) {
    super(props);

    let params = getQueryParams(props);
    fetch(`assets/data/texts/${this.props.match.params.id}.json`)
      .then((res) => res.json())
      .then((res) => {
        this.setState(() => ({
          text: res,
          meta: new TextMeta(res),
          lang1: (params["lang1"] as string) || "en",
        }));
      });
  }

  componentDidUpdate() {
    if (this.state && this.state.text) {
      document.title = this.state.text[this.state.lang1]["title"];
    }
  }

  render() {
    if (!this.state?.text) {
      return (
        <IonPage>
          <IonContent>
            <IonSpinner />
          </IonContent>
        </IonPage>
      );
    }
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton
                data-testid="back-button"
                defaultHref={`/texts/${this.props.match.params.id}${this.props.location.search}`}
              />
            </IonButtons>
            <IonTitle color="medium">
              <div className="my-wrap">
                {this.state.text[this.state.lang1]["title"]}
              </div>
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent class="ion-padding">
          <p>{this.state.text[this.state.lang1]["description"]}</p>
          <p>
            <IonText color="medium">
              <FormattedMessage id="text-info.difficulty" />
            </IonText>
            <IonText>
              <FormattedMessage
                id={`difficulty.${this.state.text.meta.difficulty}`}
              />
            </IonText>
          </p>
          <p>
            <IonText color="medium">
              <FormattedMessage id="text-info.categories" />
            </IonText>
            <IonText>{this.state.meta.prettyCategories()}</IonText>
          </p>
          {this.state.meta.sourceLink && this.state.meta.sourceText && (
            <p>
              <IonText color="medium">
                <FormattedMessage id="text-info.source" />
              </IonText>
              <a href={this.state.meta.sourceLink}>
                {this.state.meta.sourceText}
              </a>
            </p>
          )}
          {this.state.meta.redditLink && (
            <p>
              <a href={`http://reddit.com${this.state.meta.redditLink}`}>
                <FormattedMessage id="text-info.discuss-on-reddit" />
              </a>
            </p>
          )}
        </IonContent>
      </IonPage>
    );
  }
}

export default TextInfoPage;
