import React from "react";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import MainComponent from "./MainComponent";

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
    let texts: any = [
      {
        en: "It was so beautiful in the country.",
        es: "Era tan hermoso en el campo.",
      },
      {
        en: "It was the summer time.",
        es: "Era el horario de verano.",
      },
      {
        en:
          "The wheat fields were golden, the oats were green, and the hay stood in great stacks in the green meadows.",
        es:
          "Los campos de trigo eran dorados, la avena verde y el heno se amontonaba en grandes pilas en los prados verdes.",
      },
    ];

    expect(
      await this.getCardByText(texts[index][language])
    ).toBeOnVisibleCardSide();
    expect(
      await this.getCardByText(texts[index][this.otherLang(language)])
    ).not.toBeOnVisibleCardSide();
  }

  private static otherLang(lang: string): string {
    return lang === "en" ? "es" : "en";
  }

  private static async getCardByText(text: string) {
    return await screen.findByText(text);
  }
}
