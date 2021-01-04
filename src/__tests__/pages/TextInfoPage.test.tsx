import { fireEvent, screen } from "@testing-library/react";
import { DAO, Settings } from "../../common/DAO";

import { renderWithRoute, MyTextPageActions } from "../../test-common";

test("Rendering Text Info", async () => {
  renderWithRoute("/text-infos/patito-feo");

  await screen.findByText("The Ugly Duckling");
  await screen.findByText(
    '"The Ugly Duckling" is a literary fairy tale by Danish poet and author Hans Christian Andersen.'
  );
  await screen.findByText("Difficulty: Medium.");
  await screen.findByText("Categories: Children's, Fairy Tale.");
  // TODO: source
});
