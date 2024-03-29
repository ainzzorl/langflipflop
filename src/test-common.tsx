import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router";
import { DAO } from "./common/DAO";
import MainComponent from "./components/MainComponent";

export async function renderWithRoute(route: string) {
  cleanup();

  render(
    <MemoryRouter initialEntries={[route]}>
      <MainComponent />
    </MemoryRouter>
  );
}

export async function findTextCard(text: string) {
  return (await screen.findByText(text)).closest("ion-card");
}

// Stub location methods to rerender the page when window.location.href is changed.
export function stubLocation() {
  // Stub navigation.
  Object.defineProperty(window, "location", {
    value: {
      _href: "foo",
      set href(val: string) {
        this._href = val;
      },
      get href() {
        return this._href;
      },
      pathname: "foo",
    },
    writable: true,
    configurable: true,
  });
  jest.spyOn(window.location, "href", "set").mockImplementation((val) => {
    renderWithRoute(val);
  });
}

declare global {
  namespace jest {
    // eslint-disable-next-line
    interface Matchers<R> {
      toBeOnVisibleCardSide(): CustomMatcherResult;
    }
  }
}

expect.extend({
  toBeOnVisibleCardSide(received: HTMLElement) {
    if (this.isNot) {
      expect(received.closest("div")).toHaveStyle("position: absolute");
    } else {
      expect(received.closest("div")).toHaveStyle("position: relative");
    }

    // This point is reached when the above assertion was successful.
    // The test should therefore always pass, that means it needs to be
    // `true` when used normally, and `false` when `.not` was used.
    return { pass: !this.isNot, message: () => "" };
  },
});

export namespace TEST_FIXTURES {
  export const TEST_TEXT_ID = "mysterious-monolith";
  export const TEST_TEXT_TITLE_EN =
    "Mysterious Metallic Monolith Found in Remote Utah";
  export const TEST_TEXT_TITLE_ES =
    "Misterioso Monolito Metálico Encontrado en Partes Remotas de Utah";
  export const TEST_TEXT_DESCRIPTION =
    "An article about a mysterious monolith found in remote Utah.";
  export const TEST_TEXT_DIFFICULTY_STR = "Difficulty: Medium";
  export const TEST_TEXT_LENGTH = 9;
  export const TEST_TEXT_LENGTH_STR = `Length: ${TEST_TEXT_LENGTH}`;
  export const TEST_TEXT_READ_AFTER_1_STR = "(Read: 12%)";
  export const TEST_TEXT_READ_AFTER_3_STR = "(Read: 34%)";
  export const TEST_TEXT_CATEGORIES_STR = "Categories: News";
  export const TEST_TEXT_TEXTS: any = [
    {
      en:
        "In a scene that could have been taken from the science fiction classic “2001: A Space Odyssey,”",
      es:
        "En una escena que podría ser tomada del clásico de ciencia ficción “2001: Una Odisea Espacial”,",
    },
    {
      en:
        "officials in Utah have discovered a mysterious metallic monolith in the remote southeastern part of the state.",
      es:
        "los oficiales en Utah han descubierto un monolito metálico misterioso en la parte más remota del sureste del estado.",
    },
    {
      en:
        "Public safety workers spotted the object November 18 from a helicopter while conducting a count of bighorn sheep, according to a news statement.",
      es:
        "Los trabajadores de la seguridad pública detectaron el objeto el 18 de Noviembre desde un helicóptero mientras conducían un conteo de carneros, según una declaración de las noticias.",
    },
  ];

  export const FILTER_NO_MATCHES = {
    category: "children",
    difficulty: "Hard",
  };

  export const FILTER_WITH_MATCHES = {
    category: "children",
    difficulty: "Medium",

    match: "The Adventures of Tom Sawyer (Chapter 1)",
    noMatch: "Casual Phrases - Weather",
  };

  export const TEXT_NOT_IN_ALL_LANGUAGES = {
    titles: {
      en: "Joe Biden: The President",
      es: "Joe Biden: El Presidente",
    },
    in: ["en", "es"],
    notIn: ["ru"],
  };

  export const TEXT_IN_ALL_LANGUAGES = {
    titles: {
      en: "The Adventures of Tom Sawyer (Chapter 1)",
      es: "Las aventuras de Tom Sawyer (Capítulo 1)",
      ru: "Приключения Тома Сойера (Глава 1)",
    },
  };
}

export class TextPageActions {
  static async goToNext() {
    fireEvent(
      (await screen.findByText("Next"))!,
      new MouseEvent("click", {
        bubbles: true,
      })
    );
  }

  static async goToPrevious() {
    fireEvent(
      (await screen.findByText("Previous"))!,
      new MouseEvent("click", {
        bubbles: true,
      })
    );
  }

  static async assertOnPage(index: number, language: string) {
    let titles: any = {
      en: TEST_FIXTURES.TEST_TEXT_TITLE_EN,
      es: TEST_FIXTURES.TEST_TEXT_TITLE_ES,
    };

    if (index < TEST_FIXTURES.TEST_TEXT_TEXTS.length) {
      // Just don't have the values for other indexes here.
      expect(
        await this.getCardByText(TEST_FIXTURES.TEST_TEXT_TEXTS[index][language])
      ).toBeOnVisibleCardSide();
      expect(
        await this.getCardByText(
          TEST_FIXTURES.TEST_TEXT_TEXTS[index][this.otherLang(language)]
        )
      ).not.toBeOnVisibleCardSide();
    }

    expect(document.querySelector("ion-title")!.textContent).toEqual(
      `${titles[language]} (${index + 1}/${TEST_FIXTURES.TEST_TEXT_LENGTH})`
    );
  }

  static async goToTextInfo() {
    (await screen.findByTestId("go-to-text-info-button")).click();
  }

  static async clickBack() {
    let backButton = await screen.findByTestId("back-button");
    backButton.click();
  }

  static getTextFtueElement() {
    return screen.queryByTestId("text-ftue-alert");
  }

  static async waitForTextFtueElement() {
    return screen.findByTestId("text-ftue-alert");
  }

  private static otherLang(lang: string): string {
    return lang === "en" ? "es" : "en";
  }

  private static async getCardByText(text: string) {
    return await screen.findByText(text);
  }
}

export class TextInfoPageActions {
  static async assertOnPage() {
    await screen.findByText(TEST_FIXTURES.TEST_TEXT_TITLE_EN);
    await screen.findByText(TEST_FIXTURES.TEST_TEXT_DESCRIPTION);
    await screen.findByText("Difficulty:");
    await screen.findByText("Medium");
    await screen.findByText("Categories:");
    await screen.findByText("News");
    await screen.findByText("Discuss on Reddit");
  }

  static async clickBack() {
    let backButton = await screen.findByTestId("back-button");
    backButton.click();
  }
}

export async function setCompletedMainFtue() {
  return DAO.getUser().then((user) => {
    user.completedMainFtue = true;
    return DAO.setUser(user);
  });
}

export async function setCompletedTextFtue() {
  return DAO.getUser().then((user) => {
    user.completedTextFtue = true;
    return DAO.setUser(user);
  });
}

export async function setTranslationLanguages(lang1: string, lang2: string) {
  return DAO.getSettings().then((settings) => {
    settings.translationDirection = `${lang1}-${lang2}`;
    return DAO.setSettings(settings);
  });
}
