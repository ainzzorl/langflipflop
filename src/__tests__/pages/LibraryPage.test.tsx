import { within, screen } from "@testing-library/react";
import { DAO, User } from "../../common/DAO";

import {
  renderWithRoute,
  findTextCard,
  MyTextPageActions,
} from "../../test-common";

async function setCompletedFtue() {
  let user = new User();
  user.completedMainFtue = true;
  DAO.setUser(user);
}

test("Rendering Library Menu", async () => {
  await setCompletedFtue();

  renderWithRoute("/");

  let card = await findTextCard(
    "Mysterious Metallic Monolith Found in Remote Utah"
  );

  await within(card!).findByText("Difficulty: Medium");
  await within(card!).findByText("Length: 7");
  await within(card!).findByText("Categories: Article, News");
});

test("Showing Progress", async () => {
  await setCompletedFtue();

  renderWithRoute("/");
  let card = await findTextCard(
    "Mysterious Metallic Monolith Found in Remote Utah"
  );
  await within(card!).findByText("Length: 7");

  renderWithRoute("/texts/mysterious-monolith");
  await MyTextPageActions.assertOnPage(0, "en");

  renderWithRoute("/");
  card = await findTextCard(
    "Mysterious Metallic Monolith Found in Remote Utah"
  );
  await within(card!).findByText("Length: 7 (Read: 15%)");

  renderWithRoute("/texts/mysterious-monolith");
  await MyTextPageActions.assertOnPage(0, "en");
  await MyTextPageActions.goToNext();
  await MyTextPageActions.assertOnPage(1, "en");
  await MyTextPageActions.goToNext();
  await MyTextPageActions.assertOnPage(2, "en");

  renderWithRoute("/");
  card = await findTextCard(
    "Mysterious Metallic Monolith Found in Remote Utah"
  );
  await within(card!).findByText("Length: 7 (Read: 43%)");
});

test("FTUE", async () => {
  renderWithRoute("/");
  await screen.findByText("Setup");
});
