import { screen } from "@testing-library/react";
import { renderWithRoute } from "../../test-common";

test("Rendering About Page", async () => {
  renderWithRoute("/t/about");

  await screen.findByText("About LangFlipFlop");
});
