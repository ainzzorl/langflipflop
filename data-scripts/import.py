import os
import nltk
import json

def process(lang, id):
  with open(f"./data-scripts/in/{id}/{lang}.txt") as file:
    data = file.read()

    title, description, body = data.split("\n", maxsplit=2)

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
    sentences = [s for s in sentences if s != '".']

  return {
    'title': title,
    'description': description,
    'sentences': sentences
  }

def printdiff(lh, rh):
  SCREEN_WIDTH = 80
  PADDING = 2
  TEXT_WIDTH = int(SCREEN_WIDTH / 2) - 1 - PADDING
  PSTR = ' ' * PADDING

  def tochunks(s):
    return [s[i:i+TEXT_WIDTH] for i in range(0, len(s), TEXT_WIDTH)]

  def pad(s):
    return s + ' ' * (TEXT_WIDTH - len(s))

  minlen = min(len(lh), len(rh))
  for i in range(minlen):
    lchunks = tochunks(lh[i])
    rchunks = tochunks(rh[i])
    maxchunks = max(len(lchunks), len(rchunks))
    for i in range(maxchunks):
      l = pad(lchunks[i] if i < len(lchunks) else '')
      r = pad(rchunks[i] if i < len(rchunks) else '')
      print(f"{l}{PSTR}||{PSTR}{r}")
    print('-' * SCREEN_WIDTH)

for id in os.listdir('./data-scripts/in/'):
  print(id)
  en = process('en', id)
  es = process('es', id)
  with open(f"./data-scripts/in/{id}/meta.json") as f:
    meta = json.load(f)
  meta['id'] = id
  meta['numSentences'] = len(en['sentences'])

  if len(en['sentences']) != len(es['sentences']):
    printdiff(en['sentences'], es['sentences'])
    raise Exception(f"Length mismatch: en={len(en['sentences'])} vs es={len(es['sentences'])}")
  else:
    print("Everything's fine")

  final = {
    'en': en,
    'es': es,
    'meta': meta
  }

  with open(f"public/assets/data/texts/{id}.json", 'w') as outfile:
    json.dump(final, outfile, indent=2)
