import {
  MyTextPageActions,
  renderWithRoute,
  stubLocation,
  TEST_FIXTURES,
  TextInfoPageActions,
} from "../../test-common";

test("Rendering Text Info", async () => {
  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}/info`);

  await TextInfoPageActions.assertOnPage();
});

test("Back button", async () => {
  stubLocation();

  renderWithRoute(
    `/texts/${TEST_FIXTURES.TEST_TEXT_ID}/info?lang1=en&lang2=es&i=2`
  );
  await TextInfoPageActions.assertOnPage();

  await TextInfoPageActions.clickBack();
  // Expect to go to the text page.
  await MyTextPageActions.assertOnPage(1, "en");
});
