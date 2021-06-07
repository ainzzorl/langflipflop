import { fireEvent, screen } from "@testing-library/react";
import {
  findTextCard,
  renderWithRoute,
  setCompletedMainFtue,
  setCompletedTextFtue,
  stubLocation,
  TEST_FIXTURES,
  TextInfoPageActions,
  TextPageActions,
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
  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=1`);
  await TextPageActions.assertOnPage(0, "en");

  flip();
  await TextPageActions.assertOnPage(0, "es");

  await TextPageActions.goToNext();
  await TextPageActions.assertOnPage(1, "en");

  flip();
  await TextPageActions.assertOnPage(1, "es");

  await TextPageActions.goToPrevious();
  await TextPageActions.assertOnPage(0, "en");

  for (var i = 0; i < 6; i++) {
    await TextPageActions.assertOnPage(i, "en");
    await TextPageActions.goToNext();
  }

  // Last page
  await TextPageActions.assertOnPage(6, "en");
});

test("Different Translation Direction", async () => {
  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=es&lang2=en&i=1`);

  await TextPageActions.assertOnPage(0, "es");

  flip();

  await TextPageActions.assertOnPage(0, "en");

  await TextPageActions.goToNext();

  await TextPageActions.assertOnPage(1, "es");
});

// Makes little sense since indexes are now encoded in URLs.
// TODO: test it some other way.
test("Persisting Position", async () => {
  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=1`);

  await TextPageActions.assertOnPage(0, "en");
  await TextPageActions.goToNext();
  await TextPageActions.assertOnPage(1, "en");

  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=2`);

  await TextPageActions.assertOnPage(1, "en");
});

test("End-of-text", async () => {
  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=1`);
  await TextPageActions.assertOnPage(0, "en");

  for (var i = 0; i < 6; i++) {
    await TextPageActions.assertOnPage(i, "en");
    await TextPageActions.goToNext();
  }

  // Last page
  await TextPageActions.assertOnPage(6, "en");

  expect(screen.queryByText("End of Text")).not.toBeInTheDocument();

  await TextPageActions.goToNext();
  await screen.findByText("End of Text");
});

test("End-of-text - go to beginning", async () => {
  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=1`);
  await TextPageActions.assertOnPage(0, "en");

  for (var i = 0; i < 7; i++) {
    await TextPageActions.assertOnPage(i, "en");
    await TextPageActions.goToNext();
  }

  await screen.findByText("End of Text");

  (await screen.findByText("Back to Beginning")).click();

  // Must close the alert
  expect(screen.queryByText("End of Text")).not.toBeInTheDocument();
  // Must go to the beginning
  await TextPageActions.assertOnPage(0, "en");
});

test("Going to the info page", async () => {
  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=2`);
  await TextPageActions.assertOnPage(1, "en");

  await TextPageActions.goToTextInfo();
  await TextInfoPageActions.assertOnPage();
});

test("Back button", async () => {
  stubLocation();

  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=2`);
  await TextPageActions.assertOnPage(1, "en");

  await TextPageActions.clickBack();

  // Expect to go to the home page.
  await findTextCard(TEST_FIXTURES.TEST_TEXT_TITLE_EN);
});

test("Going to the info page and then back", async () => {
  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=2`);
  await TextPageActions.assertOnPage(1, "en");

  await TextPageActions.goToTextInfo();
  await TextInfoPageActions.assertOnPage();

  stubLocation();

  await TextInfoPageActions.clickBack();
  // The key thing is that it goes back to the same segment.
  await TextPageActions.assertOnPage(1, "en");
});

test("Text FTUE - first time", async () => {
  setCompletedMainFtue();

  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=1`);
  await TextPageActions.assertOnPage(0, "en");

  // Must see FTUE when opening it for the first time.
  await TextPageActions.waitForTextFtueElement();

  // Close FTUE
  let okButton = (await screen.findByTestId("text-ftue-alert")).querySelector(
    "button"
  )!;
  okButton.click();

  // FTUE popup must not be visible anymore
  expect(TextPageActions.getTextFtueElement()).toBeFalsy();

  // Reload the page
  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=1`);
  await TextPageActions.assertOnPage(0, "en");

  // FTUE popup must not be visible
  expect(TextPageActions.getTextFtueElement()).toBeFalsy();
});

test("Text FTUE - on request", async () => {
  await setCompletedMainFtue();
  await setCompletedTextFtue();

  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=1`);
  await TextPageActions.assertOnPage(0, "en");

  // FTUE popup must not be visible
  expect(TextPageActions.getTextFtueElement()).toBeFalsy();

  // Click the help button
  let helpButton = await screen.findByTestId("help-button");
  helpButton.click();

  // FTUE popup must show
  await TextPageActions.waitForTextFtueElement();
});
