.PHONY: verify
verify : lint test
			 
.PHONY: fix
fix :
			 npx prettier --write .

.PHONY: lint
lint :
			 ./node_modules/eslint/bin/eslint.js src/

.PHONY: serve
serve :
			 ionic serve

.PHONY: generate-data
generate-data :
			 python data/import.py

.PHONY: android
android :
			 ionic build
			 ionic capacitor copy android
			 (cd android && gradle installDebug)

.PHONY: android-deploy
android-deploy :
			 (cd android && gradle installDebug)

.PHONY: translate
translate :
			 python data/translate.py $(ARGS)

.PHONY: test
test :
			 npm test -- a --watchAll=false $(ARGS)

.PHONY: test-args
test-args :
			 npm test -- --watchAll=false $(ARGS)
