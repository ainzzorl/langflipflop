import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
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

export async function findTextCard(text: string) {
  return (await screen.findByText(text)).closest("ion-card");
}
