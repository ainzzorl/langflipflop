import { screen, within } from "@testing-library/react";

import { renderWithRoute, findTextCard } from "../../test-common";

test("Rendering Library Menu", async () => {
  renderWithRoute("/");

  let card = await findTextCard("The Ugly Duckling");

  await within(card!).findByText("Difficulty: Medium");
  await within(card!).findByText("Length: 225");
  await within(card!).findByText("Categories: Children's, Fairy Tale");
});
