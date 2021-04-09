import { screen } from "@testing-library/react";
import { DAO } from "../../common/DAO";

import {
  renderWithRoute,
  findTextCard,
  TEST_FIXTURES,
} from "../../test-common";

test("Auto redirects to FTUE", async () => {
  DAO.globalUser.completedMainFtue = false;
  renderWithRoute("/");
  await screen.findByText("Setup");
});

test("Completing FTUE", async () => {
  DAO.globalUser.completedMainFtue = false;
  renderWithRoute("/r/about");
  await screen.findByText("Setup");
  let startButton = await screen.findByText("Start");

  expect(screen.queryByText(TEST_FIXTURES.TEST_TEXT_TITLE_EN)).toBeFalsy();

  startButton.click();

  await findTextCard(TEST_FIXTURES.TEST_TEXT_TITLE_EN);
  await screen.queryByText(TEST_FIXTURES.TEST_TEXT_TITLE_EN);

  // No longer redirects to FTUE
  renderWithRoute("/");
  await screen.queryByText(TEST_FIXTURES.TEST_TEXT_TITLE_EN);
});
