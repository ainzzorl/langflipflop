import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import deepEqual from "fast-deep-equal/es6";
import React from "react";
import { FormattedMessage } from "react-intl";
import { RouteComponentProps, StaticContext } from "react-router";
import { categories } from "../common/categories.json";
import {
  getLocaleMessages,
  getQueryParams,
  getSearch,
  loadAllTextMetadata,
} from "../common/Common";
import { DAO, PersistentTextData, Settings } from "../common/DAO";
import TextMeta from "../common/TextMeta";
import TextCard from "../components/TextCard";

class LibraryPage extends React.Component<
  RouteComponentProps<any, StaticContext, unknown>,
  {
    texts?: Array<TextMeta>;
    categoryFilter?: string;
    difficultyFilter?: string;
    persistentTextData?: Map<string, PersistentTextData>;
    settings?: Settings;
  }
> {
  constructor(props: any) {
    super(props);

    let queryParams = getQueryParams(props);

    this.state = {
      texts: undefined,
      categoryFilter: (queryParams["category"] as string) || undefined,
      difficultyFilter: (queryParams["difficulty"] as string) || undefined,
      persistentTextData: undefined,
      settings: undefined,
    };

    this.loadTextMetadata();

    this.setCategoryFilter = this.setCategoryFilter.bind(this);
    this.setDifficultyFilter = this.setDifficultyFilter.bind(this);
    this.loadPersistentData = this.loadPersistentData.bind(this);
  }

  componentDidMount() {
    this.loadPersistentData();
  }

  componentDidUpdate() {
    this.loadPersistentData();
  }

  render() {
    if (
      !this.state.texts ||
      !this.state.persistentTextData ||
      !this.state.settings
    ) {
      return (
        <IonContent>
          <div>Loading...</div>
        </IonContent>
      );
    }

    let anyText = getLocaleMessages()["library.any"];

    return (
      <IonPage>
        <IonContent>
          <IonList>
            <IonItem>
              <IonLabel>
                <FormattedMessage id="library.category" />
              </IonLabel>
              <IonSelect
                value={this.state.categoryFilter}
                placeholder={anyText}
                interface="popover"
                onIonChange={(e) => this.setCategoryFilter(e.detail.value)}
              >
                <IonSelectOption value="" key={"selector-category-any"}>
                  <FormattedMessage id="library.any" />
                </IonSelectOption>
                {this.getCategoryOptions()}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel>
                <FormattedMessage id="library.difficulty" />
              </IonLabel>
              <IonSelect
                value={this.state.difficultyFilter}
                placeholder={anyText}
                interface="popover"
                onIonChange={(e) => this.setDifficultyFilter(e.detail.value)}
              >
                <IonSelectOption value="" key={"selector-category-any"}>
                  <FormattedMessage id="library.any" />
                </IonSelectOption>
                {this.getDifficultyOptions()}
              </IonSelect>
            </IonItem>
          </IonList>

          {this.renderTextCards()}
        </IonContent>
      </IonPage>
    );
  }

  private renderTextCards() {
    let textCards = this.state
      .texts!.filter((textMeta, _idx) => {
        return (
          !this.state.categoryFilter ||
          textMeta.categories.includes(this.state.categoryFilter)
        );
      })
      .filter((textMeta, _idx) => {
        return (
          !this.state.difficultyFilter ||
          textMeta.difficulty.includes(this.state.difficultyFilter)
        );
      })
      .map((textMeta, idx) => {
        return (
          <TextCard
            textMeta={textMeta}
            key={idx}
            persistentData={
              this.state.persistentTextData!.has(textMeta.id)
                ? this.state.persistentTextData!.get(textMeta.id)!
                : new PersistentTextData(textMeta.id)
            }
            settings={this.state.settings!}
          />
        );
      });
    if (!textCards.length) {
      return <p className="content-text">No matches.</p>;
    } else {
      return textCards;
    }
  }

  private getCategoryOptions() {
    return categories.map((category, _idx) => {
      return (
        <IonSelectOption value={category} key={"selector-category-" + category}>
          <FormattedMessage id={`category.${category}`} />
        </IonSelectOption>
      );
    });
  }

  private getDifficultyOptions() {
    return ["Easy", "Medium", "Hard"].map((difficulty, _idx) => {
      return (
        <IonSelectOption
          value={difficulty}
          key={"selector-difficulty-" + difficulty}
        >
          {difficulty}
        </IonSelectOption>
      );
    });
  }

  private loadTextMetadata() {
    loadAllTextMetadata().then((metadata) => {
      this.setState(() => ({
        texts: metadata,
      }));
    });
  }

  private setCategoryFilter(value: string) {
    this.setState(() => ({
      categoryFilter: value,
    }));
    this.addQueryParam("category", value);
  }

  private setDifficultyFilter(value: string) {
    this.setState((state) => ({
      difficultyFilter: value,
    }));
    this.addQueryParam("difficulty", value);
  }

  private addQueryParam(key: string, value: string) {
    if (window.history.replaceState) {
      let searchParams = new URLSearchParams(getSearch(this.props));
      searchParams.set(key, value);
      var newURL =
        window.location.origin +
        window.location.pathname +
        "?" +
        searchParams.toString();
      window.history.replaceState({ path: newURL }, "", newURL);
    }
  }

  private loadPersistentData() {
    DAO.getAllTextData().then((persistentData) => {
      DAO.getSettings().then((settings) => {
        // Update state only if something actually changed,
        // otherwise it can get stuck updating itself indefinitely.
        if (
          !deepEqual(this.state.persistentTextData, persistentData) ||
          !deepEqual(this.state.settings, settings)
        ) {
          this.setState(() => ({
            persistentTextData: persistentData,
            settings: settings,
          }));
        }
      });
    });
  }
}

export default LibraryPage;
