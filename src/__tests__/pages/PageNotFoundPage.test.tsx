import { screen } from "@testing-library/react";
import { renderWithRoute } from "../../test-common";

test("Rendering 404 page on unknown route", async () => {
  renderWithRoute("/unknown/route");

  await screen.findByText("Page not found");
});
