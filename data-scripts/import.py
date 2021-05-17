"""
Import texts into the distribution format.
"""

import os
import json
import sys

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

def validate_categories(categories, all_categories):
    for category in categories:
        if category not in all_categories:
            print(f"Unknown category: {category}")
            sys.exit(1)

def main():
    print(f"Cleaning up old texts under {TARGET_DIR}")
    for filename in os.listdir(TARGET_DIR):
        file_path = os.path.join(TARGET_DIR, filename)
        os.unlink(file_path)

    with open("src/common/categories.json") as f:
        all_categories = json.load(f)['categories']

    for textid in os.listdir('./data/texts/'):
        print(textid)
        with open(f"./data/texts/{textid}/meta.json") as f:
            meta = json.load(f)
        if 'languages' not in meta:
            # TODO: make this field required
            meta['languages'] = ['en', 'es']

        lang_texts = {}
        for lang in meta['languages']:
            lang_texts[lang] = process(lang, textid)

        validate_categories(meta['categories'], all_categories)

        meta['id'] = textid
        meta['numSegments'] = len(lang_texts[meta['languages'][0]]['segments'])

        for l1 in meta['languages']:
            for l2 in meta['languages']:
                if len(lang_texts[l1]['segments']) != len(lang_texts[l2]['segments']):
                    printdiff(lang_texts[l1]['segments'], lang_texts[l2]['segments'])
                    raise Exception(
                    f"Length mismatch: {l1}={len(lang_texts[l1]['segments'])} \
vs {l2}={len(lang_texts[l2]['segments'])}")
        print("Everything's fine")

        final = {
            'meta': meta
        }
        for lang in meta['languages']:
            final[lang] = lang_texts[lang]

        with open(f"public/assets/data/texts/{textid}.json", 'w') as outfile:
            json.dump(final, outfile, indent=2)

if __name__ == "__main__":
    main()
