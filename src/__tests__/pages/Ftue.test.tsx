import { screen } from "@testing-library/react";
import { DAO } from "../../common/DAO";
import {
  findTextCard,
  renderWithRoute,
  TEST_FIXTURES,
} from "../../test-common";

test("Auto redirects to the landing page", async () => {
  DAO.globalUser.completedMainFtue = false;
  renderWithRoute("/");
  await screen.findByText("Get Started");
});

test("Completing FTUE - from Recent page", async () => {
  DAO.globalUser.completedMainFtue = false;

  renderWithRoute("/t/recent?foo=bar");

  // Check we are on the FTUE page
  await screen.findByText("Setup");
  let startButton = await screen.findByText("Start");
  expect(screen.queryByText("Recent")).toBeFalsy();

  // Complete FTUE
  startButton.click();

  // Check we are back to Recent page
  await screen.findByText("Recent");
  expect(screen.queryByText("Setup")).toBeFalsy();
  // TODO: somehow test that it preserves query params.
  // Something like
  // expect(window.location.toString()).toEqual('/t/about?foo=bar');

  // No longer redirects to FTUE
  renderWithRoute("/t/recent");
  await screen.findByText("Recent");
  expect(screen.queryByText("Setup")).toBeFalsy();
});

test("Went to FTUE directly - completing FTUE", async () => {
  DAO.globalUser.completedMainFtue = false;

  renderWithRoute("/ftue");

  // Check we are on the FTUE page
  await screen.findByText("Setup");
  let startButton = await screen.findByText("Start");

  // Complete FTUE
  startButton.click();

  // Check we are on the Texts page
  await findTextCard(TEST_FIXTURES.TEST_TEXT_TITLE_EN);
});
