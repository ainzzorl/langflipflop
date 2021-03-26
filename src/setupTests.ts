// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

import fs from "fs";

import { Plugins } from "@capacitor/core";

import { mockController } from "./mocks/mockController";

const { Storage } = Plugins;

const fetchMock = require("fetch-mock-jest");

fetchMock.mock(
  () => true,
  (url: string, _options: any) => {
    return fs.readFileSync("./public/" + url, "utf8");
  }
);

// Borrowed from https://github.com/ionic-team/ionic-react-test-utils/blob/master/src/mocks/mockIonicReact.ts
jest.mock("@ionic/react", () => {
  const rest = jest.requireActual("@ionic/react");
  return {
    ...rest,
    IonActionSheet: mockController,
    IonAlert: mockController,
    IonDatetime: mockController,
    IonLoading: mockController,
    IonPicker: mockController,
    IonPopover: mockController,
    IonToast: mockController,
    IonModal: mockController,
  };
});

beforeEach(() => {
  Storage.clear();
  jest.resetAllMocks();
});
