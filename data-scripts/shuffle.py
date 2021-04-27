"""
Shuffle segments in a text.
"""

import sys
import random

# from google.cloud import translate


# def translate_text(text, project_id="supple-walker-299218"):
#     """Translating Text."""

#     client = translate.TranslationServiceClient.from_service_account_file('gcp.json')

#     location = "global"

#     parent = f"projects/{project_id}/locations/{location}"

#     # Detail on supported types can be found here:
#     # https://cloud.google.com/translate/docs/supported-formats
#     response = client.translate_text(
#         request={
#             "parent": parent,
#             "contents": [text],
#             "mime_type": "text/plain",  # mime types: text/plain, text/html
#             "source_language_code": "en-US",
#             "target_language_code": "es",
#         }
#     )

#     return [t.translated_text for t in response.translations]

if len(sys.argv) != 2:
    sys.stderr.write("Usage: shuffle.py TEXT-ID\n")
    sys.exit(1)

def clean_lines(lines):
    return [l.strip() for l in lines if l.strip()]

def joined_shuffle(a, b):
    temp = list(zip(a, b))
    random.shuffle(temp)
    return zip(*temp)

def main():
    text_id = sys.argv[1]

    with open(f"./data/in/{text_id}/en.txt") as file:
        en_text = clean_lines(file.read().split("\n"))
    with open(f"./data/in/{text_id}/es.txt") as file:
        es_text = clean_lines(file.read().split("\n"))

    title_en = en_text[0]
    description_en = en_text[1]
    lines_en = en_text[2:]

    title_es = es_text[0]
    description_es = es_text[1]
    lines_es = es_text[2:]

    shuffled_en, shuffled_es = joined_shuffle(lines_en, lines_es)

    shuffled_en = "\n".join(shuffled_en)
    shuffled_es = "\n".join(shuffled_es)

    print(shuffled_en)
    print(shuffled_es)

    out_text_en = f"{title_en}\n{description_en}\n{shuffled_en}"
    out_text_es = f"{title_es}\n{description_es}\n{shuffled_es}"

    with open(f"./data/in/{text_id}/en.txt", 'w') as f:
        f.write(out_text_en)
    with open(f"./data/in/{text_id}/es.txt", 'w') as f:
        f.write(out_text_es)

main()
