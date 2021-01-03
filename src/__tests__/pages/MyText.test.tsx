import { screen, fireEvent } from "@testing-library/react";

import { renderWithRoute } from "../../test-common";

async function getCardByText(text: string) {
  return await screen.findByText(text);
}

async function goToNext() {
  fireEvent(
    (await screen.findByText("Next"))!,
    new MouseEvent("click", {
      bubbles: true,
    })
  )
}

async function flip() {
  fireEvent(
    window.document.querySelector('.react-card-flip p')!,
    new MouseEvent("click", {
      bubbles: true,
    })
  )
}

function otherLang(lang: string): string {
  return lang === "en" ? "es" : "en";
}

async function assertOnPage(index: number, language: string) {
  let texts: any = [
    {
      'en': 'It was so beautiful in the country.',
      'es': 'Era tan hermoso en el campo.'
    },
    {
      'en': 'It was the summer time.',
      'es': 'Era el horario de verano.'
    }
  ];

  expect(await getCardByText(texts[index][language])).toBeOnVisibleCardSide();
  expect(await getCardByText(texts[index][otherLang(language)])).not.toBeOnVisibleCardSide();
}

declare global {
  namespace jest {
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

test("Rendering Text", async () => {
  renderWithRoute("/texts/patito-feo");

  await assertOnPage(0, 'en');

  flip();

  await assertOnPage(0, 'es');

  await goToNext();

  await assertOnPage(1, 'en');
});

test("Persisting Position", async () => {
  renderWithRoute("/texts/patito-feo");

  await assertOnPage(0, 'en');
  await goToNext();
  await assertOnPage(1, 'en');

  renderWithRoute("/texts/patito-feo");

  await assertOnPage(1, 'en');
});
