import { screen } from "@testing-library/react";
import {
  MyTextPageActions,
  renderWithRoute,
  TEST_FIXTURES,
} from "../../test-common";

test("Rendering Text Info", async () => {
  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}/info`);

  await screen.findByText(TEST_FIXTURES.TEST_TEXT_TITLE_EN);
  await screen.findByText(TEST_FIXTURES.TEST_TEXT_DESCRIPTION);
  await screen.findByText("Difficulty:");
  await screen.findByText("Medium");
  await screen.findByText("Categories:");
  await screen.findByText("News");
});

test("Back button", async () => {
  // Stubbing navigation.
  Object.defineProperty(window, "location", {
    value: {
      _href: "foo",
      set href(val: string) {
        this._href = val;
      },
      get href() {
        return this._href;
      },
    },
    writable: true,
    configurable: true,
  });
  jest.spyOn(window.location, "href", "set").mockImplementation((val) => {
    renderWithRoute(val);
  });

  renderWithRoute(
    `/texts/${TEST_FIXTURES.TEST_TEXT_ID}/info?lang1=en&lang2=es&i=2`
  );

  let backButton = await screen.findByTestId("back-button");
  backButton.click();

  // Expect to go to the text page.
  await MyTextPageActions.assertOnPage(1, "en");
});
