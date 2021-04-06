import { fireEvent, screen } from "@testing-library/react";

import {
  renderWithRoute,
  MyTextPageActions,
  TEST_FIXTURES,
} from "../../test-common";

async function flip() {
  fireEvent(
    window.document.querySelector(".react-card-flip p")!,
    new MouseEvent("click", {
      bubbles: true,
    })
  );
}

test("Rendering Text and Navigating", async () => {
  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es`);
  await MyTextPageActions.assertOnPage(0, "en");

  flip();
  await MyTextPageActions.assertOnPage(0, "es");

  await MyTextPageActions.goToNext();
  await MyTextPageActions.assertOnPage(1, "en");

  flip();
  await MyTextPageActions.assertOnPage(1, "es");

  await MyTextPageActions.goToPrevious();
  await MyTextPageActions.assertOnPage(0, "en");

  for (var i = 0; i < 6; i++) {
    await MyTextPageActions.assertOnPage(i, "en");
    await MyTextPageActions.goToNext();
  }

  // Last page
  await MyTextPageActions.assertOnPage(6, "en");
});

test("Different Translation Direction", async () => {
  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=es&lang2=en`);

  await MyTextPageActions.assertOnPage(0, "es");

  flip();

  await MyTextPageActions.assertOnPage(0, "en");

  await MyTextPageActions.goToNext();

  await MyTextPageActions.assertOnPage(1, "es");
});

test("Persisting Position", async () => {
  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es`);

  await MyTextPageActions.assertOnPage(0, "en");
  await MyTextPageActions.goToNext();
  await MyTextPageActions.assertOnPage(1, "en");

  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es`);

  await MyTextPageActions.assertOnPage(1, "en");
});

test("End-of-text", async () => {
  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es`);
  await MyTextPageActions.assertOnPage(0, "en");

  for (var i = 0; i < 6; i++) {
    await MyTextPageActions.assertOnPage(i, "en");
    await MyTextPageActions.goToNext();
  }

  // Last page
  await MyTextPageActions.assertOnPage(6, "en");

  expect(screen.queryByText("End of Text")).not.toBeInTheDocument();

  await MyTextPageActions.goToNext();
  await screen.findByText("End of Text");
});
