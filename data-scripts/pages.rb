require 'json'

en = File.read "./data/en.txt"
es = File.read "./data/es.txt"

def paragraphs(s)
  s
    .strip()
    .split("\n")
    .map { |p| p.strip }
    .reject { |p| p.empty? }
end

title_en = paragraphs(en)[0].strip
title_es = paragraphs(es)[0].strip

body_en = paragraphs(en).slice(1..-1).join("\n")
body_es = paragraphs(es).slice(1..-1).join("\n")

puts body_en

new_entry = {
  'en': {
    'name': title_en,
    'content': body_en
  },
  'es': {
    'name': title_es,
    'content': body_es
  }
}

entries = JSON.load File.read "./data/input.json"
entries = entries['sections']

entries += [new_entry]

result = {
  'sections': entries
}

File.open("data/input.json", "w") do |f|
  f.write(JSON.pretty_generate(result))
end
