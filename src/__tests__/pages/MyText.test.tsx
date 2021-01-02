import { screen, fireEvent } from "@testing-library/react";

import { renderWithRoute } from "../../test-common";

async function getCardByText(text: string) {
  return await screen.findByText(text);
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

  expect(
    await getCardByText("It was so beautiful in the country.")
  ).toBeOnVisibleCardSide();
  expect(
    await getCardByText("Era tan hermoso en el campo.")
  ).not.toBeOnVisibleCardSide();

  fireEvent(
    (await getCardByText("It was so beautiful in the country."))!,
    new MouseEvent("click", {
      bubbles: true,
    })
  );

  expect(
    await getCardByText("It was so beautiful in the country.")
  ).not.toBeOnVisibleCardSide();
  expect(
    await getCardByText("Era tan hermoso en el campo.")
  ).toBeOnVisibleCardSide();

  fireEvent(
    (await screen.findByText("Next"))!,
    new MouseEvent("click", {
      bubbles: true,
    })
  );

  expect(
    await getCardByText("It was the summer time.")
  ).toBeOnVisibleCardSide();
  expect(
    await getCardByText("Era el horario de verano.")
  ).not.toBeOnVisibleCardSide();
});
