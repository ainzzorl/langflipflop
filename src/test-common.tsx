import React from "react";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import MainComponent from "./MainComponent";

export function renderWithRoute(route: string) {
  cleanup();
  render(
    <MemoryRouter initialEntries={[route]}>
      <MainComponent />
    </MemoryRouter>
  );
}
