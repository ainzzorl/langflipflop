import { screen } from "@testing-library/react";

import { renderWithRoute } from "../../test-common";

// TODO: test changing settings.
// Not clear how to do it with Ionic radio buttons.

test("Rendering Settings Page", async () => {
  renderWithRoute("/t/settings");

  await screen.findByText("Settings");
  await screen.findByText("English → Spanish");
  await screen.findByText("Spanish → English");
});
