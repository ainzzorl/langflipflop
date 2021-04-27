import { screen, within } from "@testing-library/react";
import { DAO } from "../../common/DAO";
import {
  findTextCard,
  renderWithRoute,
  TEST_FIXTURES,
} from "../../test-common";

test("Rendering Recent", async () => {
  renderWithRoute("/t/recent");

  await screen.findByTestId("rendered-indicator");
  await screen.findByText("No recently opened texts.");
  expect(screen.queryByText(TEST_FIXTURES.TEST_TEXT_TITLE_EN)).toBeFalsy();

  // Update timestamp and re-render.
  await DAO.updateTextStamps(TEST_FIXTURES.TEST_TEXT_ID, 0);
  renderWithRoute("/t/recent");

  let card = await findTextCard(TEST_FIXTURES.TEST_TEXT_TITLE_EN);

  await within(card!).findByText(TEST_FIXTURES.TEST_TEXT_TITLE_EN);
  await within(card!).findByText(
    TEST_FIXTURES.TEST_TEXT_LENGTH_STR +
      " " +
      TEST_FIXTURES.TEST_TEXT_READ_AFTER_1_STR
  );
  await within(card!).findByText(TEST_FIXTURES.TEST_TEXT_CATEGORIES_STR);
});
