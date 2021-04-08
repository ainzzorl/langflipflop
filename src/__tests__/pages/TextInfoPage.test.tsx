import { screen } from "@testing-library/react";

import { renderWithRoute, TEST_FIXTURES } from "../../test-common";

test("Rendering Text Info", async () => {
  renderWithRoute("/texts/" + TEST_FIXTURES.TEST_TEXT_ID + "/info");

  await screen.findByText(TEST_FIXTURES.TEST_TEXT_TITLE_EN);
  await screen.findByText(TEST_FIXTURES.TEST_TEXT_DESCRIPTION);
  await screen.findByText("Difficulty:");
  await screen.findByText("Medium");
  await screen.findByText("Categories:");
  await screen.findByText("News");
});
