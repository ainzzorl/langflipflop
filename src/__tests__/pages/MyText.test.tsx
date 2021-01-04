import { fireEvent } from "@testing-library/react";
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

test("Rendering Text", async () => {
  renderWithRoute("/texts/patito-feo");

  await MyTextPageActions.assertOnPage(0, "en");

  flip();

  await MyTextPageActions.assertOnPage(0, "es");

  await MyTextPageActions.goToNext();

  await MyTextPageActions.assertOnPage(1, "en");
});

test("Different Translation Direction", async () => {
  let settings = new Settings();
  settings.translationDirection = "es-en";
  await DAO.setSettings(settings);

  renderWithRoute("/texts/patito-feo");

  await MyTextPageActions.assertOnPage(0, "es");

  flip();

  await MyTextPageActions.assertOnPage(0, "en");

  await MyTextPageActions.goToNext();

  await MyTextPageActions.assertOnPage(1, "es");
});

test("Persisting Position", async () => {
  renderWithRoute("/texts/patito-feo");

  await MyTextPageActions.assertOnPage(0, "en");
  await MyTextPageActions.goToNext();
  await MyTextPageActions.assertOnPage(1, "en");

  renderWithRoute("/texts/patito-feo");

  await MyTextPageActions.assertOnPage(1, "en");
});
