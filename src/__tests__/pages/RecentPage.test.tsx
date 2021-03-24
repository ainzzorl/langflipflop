import { screen, within } from "@testing-library/react";

import { renderWithRoute, findTextCard } from "../../test-common";

import { DAO } from "../../common/DAO";

test("Rendering Recent", async () => {
  renderWithRoute("/tabs/recent");

  await screen.findByTestId("rendered-indicator");
  await screen.findByText("No recently opened texts.");
  expect(
    screen.queryByText("Mysterious Metallic Monolith Found in Remote Utah")
  ).toBeFalsy();

  // Update timestamp and re-render.
  await DAO.updateTextStamps("mysterious-monolith", 0);
  renderWithRoute("/tabs/recent");

  let card = await findTextCard(
    "Mysterious Metallic Monolith Found in Remote Utah"
  );

  await within(card!).findByText("Difficulty: Medium");
  await within(card!).findByText("Length: 7 (Read: 15%)");
  await within(card!).findByText("Categories: News");
});
