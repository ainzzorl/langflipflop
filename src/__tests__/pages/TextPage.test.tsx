import { fireEvent, screen } from "@testing-library/react";
import {
  findTextCard,
  MyTextPageActions,
  renderWithRoute,
  TEST_FIXTURES,
  TextInfoPageActions,
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
  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=es&lang2=en&i=1`);

  await MyTextPageActions.assertOnPage(0, "es");

  flip();

  await MyTextPageActions.assertOnPage(0, "en");

  await MyTextPageActions.goToNext();

  await MyTextPageActions.assertOnPage(1, "es");
});

// Makes little sense since indexes are now encoded in URLs.
// TODO: test it some other way.
test("Persisting Position", async () => {
  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=1`);

  await MyTextPageActions.assertOnPage(0, "en");
  await MyTextPageActions.goToNext();
  await MyTextPageActions.assertOnPage(1, "en");

  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=2`);

  await MyTextPageActions.assertOnPage(1, "en");
});

test("End-of-text", async () => {
  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=1`);
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

test("Going to the info page", async () => {
  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=2`);
  await MyTextPageActions.assertOnPage(1, "en");

  await MyTextPageActions.goToTextInfo();
  await TextInfoPageActions.assertOnPage();
});

test("Back button", async () => {
  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=2`);
  await MyTextPageActions.assertOnPage(1, "en");

  // Stubbing navigation.
  // TODO: extract
  Object.defineProperty(window, "location", {
    value: {
      _href: "foo",
      set href(val: string) {
        this._href = val;
      },
      get href() {
        return this._href;
      },

      host: "foo",
      hostname: "foo",
      path: "foo",
      port: 123,
      protocol: "http",
      pathname: "foo",
    },
    writable: true,
    configurable: true,
  });
  jest.spyOn(window.location, "href", "set").mockImplementation((val) => {
    renderWithRoute(val);
  });

  await MyTextPageActions.clickBack();

  // Expect to go to the home page.
  await findTextCard(TEST_FIXTURES.TEST_TEXT_TITLE_EN);
});

// TODO: persistence
// TODO: info page and back to text page
// TODO: FTUE popup (at launch)
// TODO: FTUE popup (on request)
// TODO: back button
