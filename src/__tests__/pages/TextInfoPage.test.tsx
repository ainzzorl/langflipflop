import { screen } from "@testing-library/react";

import { renderWithRoute } from "../../test-common";

test("Rendering Text Info", async () => {
  renderWithRoute("/text-infos/mysterious-monolith");

  await screen.findByText("Mysterious Metallic Monolith Found in Remote Utah");
  await screen.findByText("Mysterious Metallic Monolith Found in Remote Utah.");
  await screen.findByText("Difficulty: Medium.");
  await screen.findByText("Categories: Article, News.");
});
