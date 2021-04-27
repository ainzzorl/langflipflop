"""
Import texts into the distribution format.
"""

import os
import json

def process(lang, txtid):
    with open(f"./data/texts/{txtid}/{lang}.txt") as file:
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

SCREEN_WIDTH = 80
PADDING = 2
TEXT_WIDTH = int(SCREEN_WIDTH / 2) - 1 - PADDING
PSTR = ' ' * PADDING

def printdiff(lefthand, righthand):
    """
    Print human-readable diff between two languages if they don't match.
    """

    def tochunks(val):
        return [val[i:i+TEXT_WIDTH] for i in range(0, len(val), TEXT_WIDTH)]

    def pad(val):
        return val + ' ' * (TEXT_WIDTH - len(val))

    minlen = min(len(lefthand), len(righthand))
    for i in range(minlen):
        lchunks = tochunks(lefthand[i])
        rchunks = tochunks(righthand[i])
        maxchunks = max(len(lchunks), len(rchunks))
        for j in range(maxchunks):
            left = pad(lchunks[j] if j < len(lchunks) else '')
            right = pad(rchunks[j] if j < len(rchunks) else '')
            print(f"{left}{PSTR}||{PSTR}{right}")
        print('-' * SCREEN_WIDTH)

TARGET_DIR = 'public/assets/data/texts'

def main():
    print(f"Cleaning up old texts under {TARGET_DIR}")
    for filename in os.listdir(TARGET_DIR):
        file_path = os.path.join(TARGET_DIR, filename)
        os.unlink(file_path)

    for textid in os.listdir('./data/texts/'):
        print(textid)
        en = process('en', textid)
        es = process('es', textid)
        with open(f"./data/texts/{textid}/meta.json") as f:
            meta = json.load(f)
        meta['id'] = textid
        meta['numSegments'] = len(en['segments'])

        if len(en['segments']) != len(es['segments']):
            printdiff(en['segments'], es['segments'])
            raise Exception(
              f"Length mismatch: en={len(en['segments'])} vs es={len(es['segments'])}")
        print("Everything's fine")

        final = {
            'en': en,
            'es': es,
            'meta': meta
        }

        with open(f"public/assets/data/texts/{textid}.json", 'w') as outfile:
            json.dump(final, outfile, indent=2)

if __name__ == "__main__":
    main()
