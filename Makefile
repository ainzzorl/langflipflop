.PHONY: fix
fix :
			 npx prettier --write .

.PHONY: serve
serve :
			 ionic serve

.PHONY: generate-data
generate-data :
			 ruby data-scripts/ionic.rb
