import { screen, within } from "@testing-library/react";

import { renderWithRoute, findTextCard } from "../../test-common";

import { DAO } from "../../common/DAO";

test("Rendering Recent", async () => {
  renderWithRoute("/tabs/recent");

  await screen.findByTestId("rendered-indicator");
  expect(screen.queryByText("The Ugly Duckling")).toBeFalsy();

  // Update timestamp and re-render.
  await DAO.updateTextStamps("patito-feo", 0);
  renderWithRoute("/tabs/recent");

  let card = await findTextCard("The Ugly Duckling");

  await within(card!).findByText("Difficulty: Medium");
  await within(card!).findByText("Length: 225 (Read: 1%)");
  await within(card!).findByText("Categories: Children's, Fairy Tale");
});
