import sys
from google.cloud import translate


def translate_text(text, project_id="supple-walker-299218"):
    """Translating Text."""

    client = translate.TranslationServiceClient.from_service_account_file('gcp.json')

    location = "global"

    parent = f"projects/{project_id}/locations/{location}"

    # Detail on supported types can be found here:
    # https://cloud.google.com/translate/docs/supported-formats
    response = client.translate_text(
        request={
            "parent": parent,
            "contents": [text],
            "mime_type": "text/plain",  # mime types: text/plain, text/html
            "source_language_code": "en-US",
            "target_language_code": "es",
        }
    )

    return [t.translated_text for t in response.translations]

if len(sys.argv) != 2:
    sys.stderr.write("Usage: translate.py TEXT-ID\n")
    exit(1)

text_id = sys.argv[1]

with open(f"./data-scripts/in/{text_id}/en.txt") as file:
    source_text = file.read()

translated_texts = translate_text(text=source_text)
translated_text = '\n'.join(translated_texts)

with open(f"./data-scripts/in/{text_id}/es.txt", 'w') as f:
    f.write(translated_text)