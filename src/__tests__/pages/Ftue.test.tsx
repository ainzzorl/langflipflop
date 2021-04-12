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

test("Completing FTUE - from About page", async () => {
  DAO.globalUser.completedMainFtue = false;

  renderWithRoute("/t/about?foo=bar");

  // Check we are on the FTUE page
  await screen.findByText("Setup");
  let startButton = await screen.findByText("Start");
  expect(screen.queryByText("About LangFlipFlop")).toBeFalsy();

  // Complete FTUE
  startButton.click();

  // Check we are back to About page
  await screen.findByText("About LangFlipFlop");
  expect(screen.queryByText("Setup")).toBeFalsy();
  // TODO: somehow test that it preserves query params.
  // Something like
  // expect(window.location.toString()).toEqual('/t/about?foo=bar');

  // No longer redirects to FTUE
  renderWithRoute("/t/about");
  await screen.findByText("About LangFlipFlop");
  expect(screen.queryByText("Setup")).toBeFalsy();
});

test("Went to FTUE directly - completing FTUE", async () => {
  DAO.globalUser.completedMainFtue = false;

  renderWithRoute("/ftue");

  // Check we are on the FTUE page
  await screen.findByText("Setup");
  let startButton = await screen.findByText("Start");
  expect(screen.queryByText("About LangFlipFlop")).toBeFalsy();

  // Complete FTUE
  startButton.click();

  // Check we are on the Texts page
  await findTextCard(TEST_FIXTURES.TEST_TEXT_TITLE_EN);
});
