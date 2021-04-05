import React from "react";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import MainComponent from "./components/MainComponent";

export function renderWithRoute(route: string) {
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
  export const TEST_TEXT_LENGTH = 7;
  export const TEST_TEXT_LENGTH_STR = `Length: ${TEST_TEXT_LENGTH}`;
  export const TEST_TEXT_READ_AFTER_1_STR = "(Read: 15%)";
  export const TEST_TEXT_READ_AFTER_3_STR = "(Read: 43%)";
  export const TEST_TEXT_CATEGORIES_STR = "Categories: News";
  export const TEST_TEXT_TEXTS: any = [
    {
      en:
        "In a scene that could have been taken from the science fiction classic “2001: A Space Odyssey,” officials in Utah have discovered a mysterious metallic monolith in the remote southeastern part of the state.",
      es:
        "En una escena que podría ser tomada del clásico de ciencia ficción “2001: Una Odisea Espacial”, los oficiales en Utah han descubierto un monolito metálico misterioso en la parte más remota del sureste del estado.",
    },
    {
      en:
        "Public safety workers spotted the object November 18 from a helicopter while conducting a count of bighorn sheep, according to a news statement.",
      es:
        "Los trabajadores de la seguridad pública detectaron el objeto el 18 de Noviembre desde un helicóptero mientras conducían un conteo de carneros, según una declaración de las noticias.",
    },
    {
      en:
        "So far, there is no indication of who could have placed the 3- to 3.6-meter-tall monolith in that location.",
      es:
        "Hasta ahora, no hay indicativos de quién pudo haber colocado el monolito de 3 a 3.6 metros en esa ubicación.",
    },
  ];
}

export class MyTextPageActions {
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

  private static otherLang(lang: string): string {
    return lang === "en" ? "es" : "en";
  }

  private static async getCardByText(text: string) {
    return await screen.findByText(text);
  }
}
