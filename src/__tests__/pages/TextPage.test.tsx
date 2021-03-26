import { fireEvent, screen } from "@testing-library/react";
import { DAO, Settings } from "../../common/DAO";

import { renderWithRoute, MyTextPageActions } from "../../test-common";

async function flip() {
  fireEvent(
    window.document.querySelector(".react-card-flip p")!,
    new MouseEvent("click", {
      bubbles: true,
    })
  );
}

test("Rendering Text and Navigating", async () => {
  renderWithRoute("/texts/mysterious-monolith");
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
  let settings = new Settings();
  settings.translationDirection = "es-en";
  await DAO.setSettings(settings);

  renderWithRoute("/texts/mysterious-monolith");

  await MyTextPageActions.assertOnPage(0, "es");

  flip();

  await MyTextPageActions.assertOnPage(0, "en");

  await MyTextPageActions.goToNext();

  await MyTextPageActions.assertOnPage(1, "es");
});

test("Persisting Position", async () => {
  renderWithRoute("/texts/mysterious-monolith");

  await MyTextPageActions.assertOnPage(0, "en");
  await MyTextPageActions.goToNext();
  await MyTextPageActions.assertOnPage(1, "en");

  renderWithRoute("/texts/mysterious-monolith");

  await MyTextPageActions.assertOnPage(1, "en");
});

test("End-of-text", async () => {
  renderWithRoute("/texts/mysterious-monolith");
  await MyTextPageActions.assertOnPage(0, "en");

  for (var i = 0; i < 6; i++) {
    await MyTextPageActions.assertOnPage(i, "en");
    await MyTextPageActions.goToNext();
  }

  // Last page
  await MyTextPageActions.assertOnPage(6, "en");

  expect(screen.queryByText("The End")).not.toBeInTheDocument();

  await MyTextPageActions.goToNext();
  await screen.findByText("The End");
});
