import { screen, within } from "@testing-library/react";

import { renderWithRoute } from "../../test-common";

test("Rendering Library Menu", async () => {
  renderWithRoute("/");

  let card = await (await screen.findByText("The Ugly Duckling")).closest(
    "ion-card"
  );

  await within(card!).findByText("Difficulty: Medium");
  await within(card!).findByText("Length: 225");
  await within(card!).findByText("Categories: Children's, Fairy Tale");
});
