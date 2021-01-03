import { within } from "@testing-library/react";

import {
  renderWithRoute,
  findTextCard,
  MyTextPageActions,
} from "../../test-common";

test("Rendering Library Menu", async () => {
  renderWithRoute("/");

  let card = await findTextCard("The Ugly Duckling");

  await within(card!).findByText("Difficulty: Medium");
  await within(card!).findByText("Length: 225");
  await within(card!).findByText("Categories: Children's, Fairy Tale");
});

test("Showing Progress", async () => {
  renderWithRoute("/");
  let card = await findTextCard("The Ugly Duckling");
  await within(card!).findByText("Length: 225");

  renderWithRoute("/texts/patito-feo");
  await MyTextPageActions.assertOnPage(0, "en");

  renderWithRoute("/");
  card = await findTextCard("The Ugly Duckling");
  await within(card!).findByText("Length: 225 (Read: 1%)");

  renderWithRoute("/texts/patito-feo");
  await MyTextPageActions.assertOnPage(0, "en");
  await MyTextPageActions.goToNext();
  await MyTextPageActions.assertOnPage(1, "en");
  await MyTextPageActions.goToNext();
  await MyTextPageActions.assertOnPage(2, "en");

  renderWithRoute("/");
  card = await findTextCard("The Ugly Duckling");
  await within(card!).findByText("Length: 225 (Read: 2%)");
});
