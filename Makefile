.PHONY: fix
fix :
			 npx prettier --write .

.PHONY: serve
serve :
			 ionic serve

.PHONY: generate-data
generate-data :
			 python data-scripts/import.py

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
			 python data-scripts/translate.py $(ARGS)

.PHONY: test
test :
			 npm test -- a --watchAll=false $(ARGS)

.PHONY: test-args
test-args :
			 npm test -- --watchAll=false $(ARGS)
