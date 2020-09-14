require 'json'

def process(lang)
  input = File.read "./data-scripts/in/#{lang}.txt"

  sentences = input.strip()
              .split(/\.|\n/)
              .map { |p| p.strip }
              .reject { |p| p.empty? }

  title, *sentences = sentences

  {
    'title': title,
    'sentences': sentences
  }
end

en = process('en')
es = process('es')

if en[:sentences].length != es[:sentences].length then
  raise "Length mismatch: en=#{en[:sentences].length} vs es=#{es[:sentences].length}"
else
  puts "Everything's fine"
end

final = {
  'en': en,
  'es': es
}

File.open("public/assets/data/texts/hufflepuff-common-room.json","w") do |f|
  f.write(JSON.pretty_generate(final))
end
