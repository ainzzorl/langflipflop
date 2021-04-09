import { within, screen } from "@testing-library/react";
import { DAO, User } from "../../common/DAO";

import {
  renderWithRoute,
  findTextCard,
  MyTextPageActions,
  TEST_FIXTURES,
} from "../../test-common";

async function setCompletedFtue() {
  let user = new User();
  user.completedMainFtue = true;
  DAO.setUser(user);
}

test("Rendering Library Menu", async () => {
  await setCompletedFtue();

  renderWithRoute("/");

  let card = await findTextCard(TEST_FIXTURES.TEST_TEXT_TITLE_EN);

  await within(card!).findByText(TEST_FIXTURES.TEST_TEXT_DIFFICULTY_STR);
  await within(card!).findByText(TEST_FIXTURES.TEST_TEXT_LENGTH_STR);
  await within(card!).findByText(TEST_FIXTURES.TEST_TEXT_CATEGORIES_STR);
});

test("Showing Progress", async () => {
  await setCompletedFtue();

  renderWithRoute("/");
  let card = await findTextCard(TEST_FIXTURES.TEST_TEXT_TITLE_EN);
  await within(card!).findByText(TEST_FIXTURES.TEST_TEXT_LENGTH_STR);

  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=1`);
  await MyTextPageActions.assertOnPage(0, "en");

  renderWithRoute("/");
  card = await findTextCard(TEST_FIXTURES.TEST_TEXT_TITLE_EN);
  await within(card!).findByText(
    TEST_FIXTURES.TEST_TEXT_LENGTH_STR +
      " " +
      TEST_FIXTURES.TEST_TEXT_READ_AFTER_1_STR
  );

  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=1`);
  await MyTextPageActions.assertOnPage(0, "en");
  await MyTextPageActions.goToNext();
  await MyTextPageActions.assertOnPage(1, "en");
  await MyTextPageActions.goToNext();
  await MyTextPageActions.assertOnPage(2, "en");

  renderWithRoute("/");
  card = await findTextCard(TEST_FIXTURES.TEST_TEXT_TITLE_EN);
  await within(card!).findByText(
    TEST_FIXTURES.TEST_TEXT_LENGTH_STR +
      " " +
      TEST_FIXTURES.TEST_TEXT_READ_AFTER_3_STR
  );
});

test("FTUE", async () => {
  DAO.globalUser.completedMainFtue = false;
  renderWithRoute("/");
  await screen.findByText("Setup");
});
