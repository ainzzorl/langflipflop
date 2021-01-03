import React from "react";
import MainComponent from "../../MainComponent";

import { screen, within, cleanup, render } from "@testing-library/react";

import { renderWithRoute, findTextCard } from "../../test-common";

import { MemoryRouter } from "react-router";

import { DAO } from "../../common/DAO";

test("Rendering Recent", async () => {
  renderWithRoute("/tabs/recent");

  await screen.findByTestId("rendered-indicator");
  expect(screen.queryByText("The Ugly Duckling")).toBeFalsy();

  // Update timestamp and re-render.
  await DAO.updateTextLastOpened("patito-feo");
  renderWithRoute("/tabs/recent");

  let card = await findTextCard("The Ugly Duckling");

  await within(card!).findByText("Difficulty: Medium");
  await within(card!).findByText("Length: 225");
  await within(card!).findByText("Categories: Children's, Fairy Tale");
});
