import React from "react";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import MainComponent from "./../../MainComponent";
import fs from "fs";

const fetchMock = require("fetch-mock-jest");

fetchMock.mock(
  () => true,
  (url: string, _options: any) => {
    return fs.readFileSync("./public/" + url, "utf8");
  }
);

test("Rendering Library Menu", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <MainComponent />
    </MemoryRouter>
  );

  let card = await (await screen.findByText("The Ugly Duckling")).closest(
    "ion-card"
  );

  await within(card!).findByText("Difficulty: Medium");
  await within(card!).findByText("Length: 225");
  await within(card!).findByText("Categories: Children's, Fairy Tale");
});
