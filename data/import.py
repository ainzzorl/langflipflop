import os
import json

def process(lang, id):
  with open(f"./data/in/{id}/{lang}.txt") as file:
    data = file.read()

    title, description, body = data.split("\n", maxsplit=2)

    segments = body.split("\n")
    segments = [s.strip() for s in segments]
    segments = [s.strip() for s in segments if s]

  return {
    'title': title,
    'description': description,
    'segments': segments
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

TARGET_DIR = 'public/assets/data/texts'
print(f"Cleaning up old texts under {TARGET_DIR}")
for fn in os.listdir(TARGET_DIR):
    file_path = os.path.join(TARGET_DIR, fn)
    os.unlink(file_path)

for id in os.listdir('./data/in/'):
  print(id)
  en = process('en', id)
  es = process('es', id)
  with open(f"./data/in/{id}/meta.json") as f:
    meta = json.load(f)
  meta['id'] = id
  meta['numSegments'] = len(en['segments'])

  if len(en['segments']) != len(es['segments']):
    printdiff(en['segments'], es['segments'])
    raise Exception(f"Length mismatch: en={len(en['segments'])} vs es={len(es['segments'])}")
  else:
    print("Everything's fine")

  final = {
    'en': en,
    'es': es,
    'meta': meta
  }

  with open(f"public/assets/data/texts/{id}.json", 'w') as outfile:
    json.dump(final, outfile, indent=2)
