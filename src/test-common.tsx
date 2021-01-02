import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import MainComponent from "./MainComponent";

export function renderWithRoute(route: string) {
  render(
    <MemoryRouter initialEntries={[route]}>
      <MainComponent />
    </MemoryRouter>
  );
}
