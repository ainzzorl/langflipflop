require 'json'

input_file = File.open "./data/input.json"
script_content = File.read "./script.js"
style_content = File.read "./style.css"
data = JSON.load input_file
sections = data['sections']

def paragraphs(s)
  s
    .strip()
    .split("\n")
    .map { |p| p.strip }
    .reject { |p| p.empty? }
end

# def sentences(s)
#   s
#     .strip()
#     .split('.')
#     .map { |p| p.strip }
#     .reject { |p| p.empty? }
# end

sections_html = sections.map do |section_data|
  section_html = "<h2>#{section_data['en']['name']}</h2>"

  paragraphs_en = paragraphs(section_data['en']['content'])
  paragraphs_es = paragraphs(section_data['es']['content'])
  if paragraphs_en.size != paragraphs_es.size
    raise "Num paragraphs mismatch, #{paragraphs_en.size} vs #{paragraphs_es.size}"
  end
  paragraphs_en.zip(paragraphs_es).each do |p_en, p_es|
#     sentences_en = sentences(p_en)
#     sentences_es = sentences(p_es)
#     raise "Num sentences mismatch, #{sentences_en.size} vs #{sentences_es.size}. en=#{sentences_en}, es=#{sentences_es}" unless sentences_en.size == sentences_es.size

#     p_html = sentences_en.zip(sentences_es).map do |s_en, s_es|
#       s_en
#     end.join(' ')

    p_html = p_en

    p_html = "<p en='#{p_en}' es='#{p_es}' lang='en' onclick='onTranslationClick(this)'>#{p_html}</p>"
    section_html += p_html
  end

  section_html = "<div>#{section_html}</div>"
  section_html
end.join(' ')


html = ''

def wrap_sections_in_html(sections_html, script_content, style_content)
  result = ''
  result += '<html>'
  result += '<head>'
  result += '<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" crossorigin="anonymous">

<!-- Optional theme -->
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap-theme.min.css" integrity="sha384-6pzBo3FDv/PJ8r2KRkGHifhEocL+1X2rVCTTkUfGk7/0pbek5mMa1upzvWbrUbOZ" crossorigin="anonymous">'
  result += "<script>#{script_content}</script>"
  result += "<style>#{style_content}</style>"
  result += '</head>'
  result += '<body class="container-fluid">'
  result += sections_html
  result += '</body>'
  result += '</html>'
  result
end

result = wrap_sections_in_html(sections_html, script_content, style_content)
puts result
File.write('data/index.html', result)