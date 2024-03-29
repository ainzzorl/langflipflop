import { screen, within } from "@testing-library/react";
import {
  findTextCard,
  renderWithRoute,
  setCompletedMainFtue,
  setTranslationLanguages,
  TEST_FIXTURES,
  TextPageActions,
} from "../../test-common";

test("Rendering Library Menu", async () => {
  await setCompletedMainFtue();

  renderWithRoute("/");

  let card = await findTextCard(TEST_FIXTURES.TEST_TEXT_TITLE_EN);

  await within(card!).findByText(TEST_FIXTURES.TEST_TEXT_DIFFICULTY_STR);
  await within(card!).findByText(TEST_FIXTURES.TEST_TEXT_LENGTH_STR);
  await within(card!).findByText(TEST_FIXTURES.TEST_TEXT_CATEGORIES_STR);
});

test("Showing Progress", async () => {
  await setCompletedMainFtue();

  renderWithRoute("/");
  let card = await findTextCard(TEST_FIXTURES.TEST_TEXT_TITLE_EN);
  await within(card!).findByText(TEST_FIXTURES.TEST_TEXT_LENGTH_STR);

  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=1`);
  await TextPageActions.assertOnPage(0, "en");

  renderWithRoute("/");
  card = await findTextCard(TEST_FIXTURES.TEST_TEXT_TITLE_EN);
  await within(card!).findByText(
    TEST_FIXTURES.TEST_TEXT_LENGTH_STR +
      " " +
      TEST_FIXTURES.TEST_TEXT_READ_AFTER_1_STR
  );

  renderWithRoute(`/texts/${TEST_FIXTURES.TEST_TEXT_ID}?lang1=en&lang2=es&i=1`);
  await TextPageActions.assertOnPage(0, "en");
  await TextPageActions.goToNext();
  await TextPageActions.assertOnPage(1, "en");
  await TextPageActions.goToNext();
  await TextPageActions.assertOnPage(2, "en");

  renderWithRoute("/");
  card = await findTextCard(TEST_FIXTURES.TEST_TEXT_TITLE_EN);
  await within(card!).findByText(
    TEST_FIXTURES.TEST_TEXT_LENGTH_STR +
      " " +
      TEST_FIXTURES.TEST_TEXT_READ_AFTER_3_STR
  );
});

test("Filtering - with matches", async () => {
  await setCompletedMainFtue();

  // Sanity check that the texts that are supposed to be filtered exist at all.
  renderWithRoute("/t/texts");
  await findTextCard(TEST_FIXTURES.FILTER_WITH_MATCHES.match);
  await findTextCard(TEST_FIXTURES.FILTER_WITH_MATCHES.noMatch);

  // Do filter.
  renderWithRoute(
    `/t/texts?category=${TEST_FIXTURES.FILTER_WITH_MATCHES.category}&difficulty=${TEST_FIXTURES.FILTER_WITH_MATCHES.difficulty}`
  );

  await findTextCard(TEST_FIXTURES.FILTER_WITH_MATCHES.match);
  expect(
    screen.queryByText(TEST_FIXTURES.FILTER_WITH_MATCHES.noMatch)
  ).toBeFalsy();
});

test("Filtering - no matches", async () => {
  await setCompletedMainFtue();

  // Do filter.
  renderWithRoute(
    `/t/texts?category=${TEST_FIXTURES.FILTER_NO_MATCHES.category}&difficulty=${TEST_FIXTURES.FILTER_NO_MATCHES.difficulty}`
  );

  await screen.findByText("No matches.");
  expect(screen.queryByText(TEST_FIXTURES.TEST_TEXT_TITLE_EN)).toBeFalsy();
});

test("Filtering by availability in the language", async () => {
  await setCompletedMainFtue();

  let in1 = TEST_FIXTURES.TEXT_NOT_IN_ALL_LANGUAGES.in[0];
  let in2 = TEST_FIXTURES.TEXT_NOT_IN_ALL_LANGUAGES.in[1];
  let notIn = TEST_FIXTURES.TEXT_NOT_IN_ALL_LANGUAGES.notIn[0];
  let titles: any = TEST_FIXTURES.TEXT_NOT_IN_ALL_LANGUAGES.titles;
  let textInAllLanguagesTitles: any =
    TEST_FIXTURES.TEXT_IN_ALL_LANGUAGES.titles;

  // Shows both in1->in2 and in2 -> in1
  await setTranslationLanguages(in1, in2);
  renderWithRoute(`/t/texts`);
  await findTextCard(titles[in1]);
  await setTranslationLanguages(in2, in1);
  renderWithRoute(`/t/texts`);
  await findTextCard(titles[in2]);

  // Does not show in in1->notIn
  await setTranslationLanguages(in1, notIn);
  renderWithRoute(`/t/texts`);
  // Waiting for the page to load.
  await findTextCard(textInAllLanguagesTitles[in1]);

  expect(screen.queryByText(titles[in1])).toBeFalsy();

  // Not so clear how to test notIn->in1 because we don't even know the title,
  // but it should be fine.
});

// TODO: test navigation to texts
