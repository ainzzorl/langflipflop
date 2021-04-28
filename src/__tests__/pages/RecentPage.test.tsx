import { screen, within } from "@testing-library/react";
import {
  findTextCard,
  renderWithRoute,
  TEST_FIXTURES,
  TextPageActions,
} from "../../test-common";

test("Rendering Recent", async () => {
  await renderWithRoute("/t/recent");

  // Open Recent page, expect no texts at first.
  await screen.findByText("No recently opened texts.");
  expect(screen.queryByText(TEST_FIXTURES.TEST_TEXT_TITLE_EN)).toBeFalsy();

  // Open text
  await renderWithRoute(
    `/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=1`
  );
  await TextPageActions.assertOnPage(0, "en");

  // Go back to Recent
  await renderWithRoute("/t/recent");

  let card = await findTextCard(TEST_FIXTURES.TEST_TEXT_TITLE_EN);

  await within(card!).findByText(TEST_FIXTURES.TEST_TEXT_TITLE_EN);
  await within(card!).findByText(
    TEST_FIXTURES.TEST_TEXT_LENGTH_STR +
      " " +
      TEST_FIXTURES.TEST_TEXT_READ_AFTER_1_STR
  );
  await within(card!).findByText(TEST_FIXTURES.TEST_TEXT_CATEGORIES_STR);
});
