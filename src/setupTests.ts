// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

import fs from "fs";

import { Plugins } from "@capacitor/core";

const { Storage } = Plugins;

const fetchMock = require("fetch-mock-jest");

fetchMock.mock(
  () => true,
  (url: string, _options: any) => {
    return fs.readFileSync("./public/" + url, "utf8");
  }
);

beforeEach(() => {
  Storage.clear();
  jest.resetAllMocks();
});
