"""
Shuffle segments in a text.
"""

import sys
import random

def clean_lines(lines):
    return [l.strip() for l in lines if l.strip()]

def joined_shuffle(a, b):
    temp = list(zip(a, b))
    random.shuffle(temp)
    return zip(*temp)

def main():
    if len(sys.argv) != 2:
        sys.stderr.write("Usage: shuffle.py TEXT-ID\n")
        sys.exit(1)

    text_id = sys.argv[1]

    with open(f"./data/texts/{text_id}/en.txt") as file:
        en_text = clean_lines(file.read().split("\n"))
    with open(f"./data/texts/{text_id}/es.txt") as file:
        es_text = clean_lines(file.read().split("\n"))

    title_en, description_en, segments_en = en_text[0], en_text[1], en_text[2:]
    title_es, description_es, segments_es = es_text[0], es_text[1], es_text[2:]

    shuffled_en, shuffled_es = joined_shuffle(segments_en, segments_es)

    shuffled_en = "\n".join(shuffled_en)
    shuffled_es = "\n".join(shuffled_es)

    print(shuffled_en)
    print(shuffled_es)

    out_text_en = f"{title_en}\n{description_en}\n{shuffled_en}"
    out_text_es = f"{title_es}\n{description_es}\n{shuffled_es}"

    with open(f"./data/texts/{text_id}/en.txt", 'w') as f:
        f.write(out_text_en)
    with open(f"./data/texts/{text_id}/es.txt", 'w') as f:
        f.write(out_text_es)

if __name__ == "__main__":
    main()
