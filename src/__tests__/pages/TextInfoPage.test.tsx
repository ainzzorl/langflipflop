import { screen } from "@testing-library/react";

import { renderWithRoute } from "../../test-common";

test("Rendering Text Info", async () => {
  renderWithRoute("/text-infos/mysterious-monolith");

  await screen.findByText("Mysterious Metallic Monolith Found in Remote Utah");
  await screen.findByText(
    "An article about a mysterious monolith found in remote Utah."
  );
  await screen.findByText("Difficulty:");
  await screen.findByText("Medium");
  await screen.findByText("Categories:");
  await screen.findByText("News");
});
