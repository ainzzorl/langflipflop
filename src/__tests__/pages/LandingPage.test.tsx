import { screen } from "@testing-library/react";
import { renderWithRoute } from "../../test-common";

test("Rendering Landing Page", async () => {
  renderWithRoute("/landing");

  await screen.findByText("Get Started");
});
