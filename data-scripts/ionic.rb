require 'json'

def paragraphs(s)
  s
    .strip()
    .split("\n")
    .map { |p| p.strip }
    .reject { |p| p.empty? }
end

def process(lang)
  input = File.read "./data/in/#{lang}.txt"

  sentences = input.strip()
              .split("\.|\n")
              .map { |p| p.strip }
              .reject { |p| p.empty? }

  output = sentences.join("\\n")

  File.open("data/out/#{lang}.txt", "w") do |f|
    f.write(output)
  end
  sentences.length
end

len_en = process('en')
len_es = process('es')

if len_en != len_es then
  raise "Length mismatch: en=#{len_en} vs es=#{len_es}"
else
  puts "Everything's fine"
end
