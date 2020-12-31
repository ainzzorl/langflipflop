import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import MainComponent from "./MainComponent";
import fs from "fs";

const fetchMock = require("fetch-mock-jest");

fetchMock.mock(
  () => true,
  (url: string, _options: any) => {
    return fs.readFileSync("./public/" + url, "utf8");
  }
);

test("Rendering Library Menu", async () => {
  const { findByText } = render(
    <MemoryRouter initialEntries={["/"]}>
      <MainComponent />
    </MemoryRouter>
  );
  await findByText("The Ugly Duckling");
});
