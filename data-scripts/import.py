import os
import nltk
import json

def process(lang, id):
  with open(f"./data-scripts/in/{id}/{lang}.txt") as file:
    data = file.read()

    title, body = data.split("\n", maxsplit=1)

    if lang == 'en':
      tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')
    elif lang == 'es':
      tokenizer = nltk.data.load('tokenizers/punkt/spanish.pickle')
    else:
      raise f"Unsupported language: {lang}"

    paragraphs = [p for p in body.split('\n') if p]
    sentences = []
    for paragraph in paragraphs:
        sentences += tokenizer.tokenize(paragraph)

  return {
    'title': title,
    'sentences': sentences
  }

for id in os.listdir('./data-scripts/in/'):
  print(id)
  en = process('en', id)
  es = process('es', id)

  if len(en['sentences']) != len(es['sentences']):
    minlen = min(len(en['sentences']), len(es['sentences']))
    for i in range(minlen):
      print(f"{en['sentences'][i]}\n<=>\n{es['sentences'][i]}\n\n-------------------------------")
    raise Exception(f"Length mismatch: en={len(en['sentences'])} vs es={len(es['sentences'])}")
  else:
    print("Everything's fine")

  final = {
    'en': en,
    'es': es
  }

  with open(f"public/assets/data/texts/{id}.json", 'w') as outfile:
    json.dump(final, outfile, indent=2)
