import { fireEvent } from "@testing-library/react";

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

test("Persisting Position", async () => {
  renderWithRoute("/texts/patito-feo");

  await MyTextPageActions.assertOnPage(0, "en");
  await MyTextPageActions.goToNext();
  await MyTextPageActions.assertOnPage(1, "en");

  renderWithRoute("/texts/patito-feo");

  await MyTextPageActions.assertOnPage(1, "en");
});
