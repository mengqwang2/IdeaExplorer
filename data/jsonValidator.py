import io, json

with open('ideas.txt') as json_file:
	data=json.load(json_file,strict=False)

with io.open('ideas1.txt', 'w', encoding='utf-8') as f:
	f.write(unicode(json.dumps(data, ensure_ascii=False)))