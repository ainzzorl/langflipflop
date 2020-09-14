require 'json'

def process(lang, id)
  input = File.read "./data-scripts/in/#{id}/#{lang}.txt"

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

Dir.entries('./data-scripts/in/')[2..-1].each do |id|
  puts id
  en = process('en', id)
  es = process('es', id)

  if en[:sentences].length != es[:sentences].length then
    (0...[en[:sentences].length, es[:sentences].length].min).each do |i|
      puts("#{en[:sentences][i]} <=> #{es[:sentences][i]}\n\n")
    end
    raise "Length mismatch: en=#{en[:sentences].length} vs es=#{es[:sentences].length}"
  else
    puts "Everything's fine"
  end

  final = {
    'en': en,
    'es': es
  }

  File.open("public/assets/data/texts/#{id}.json","w") do |f|
    f.write(JSON.pretty_generate(final))
  end
end
