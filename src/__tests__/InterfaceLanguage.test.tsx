import { screen } from "@testing-library/react";
import { ionFireEvent } from "../mocks/ionFireEvent";
import { renderWithRoute } from "../test-common";

test("Changing Interface Language", async () => {
  // English by default
  renderWithRoute("/t/about");
  await screen.findByText("About LangFlipFlop");

  renderWithRoute("/t/settings");
  await screen.findByText("Settings");
  await screen.findByText("Español");

  // Switch to Spanish
  ionFireEvent.ionChange(
    await screen.findByTestId("select-interface-language"),
    "es"
  );

  // Settings page is changed to Spanish right away
  await screen.findAllByText("Ajustes");

  // Reload About page, it should be in Spanish too
  renderWithRoute("/t/about");
  await screen.findByText("Sobre LangFlipFlop");
});
