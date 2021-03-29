.PHONY: verify
verify : lint test
			 
.PHONY: fix
fix :
			 npx prettier --write .

.PHONY: lint
lint :
			 npx eslint src/
			 npx prettier -c src/

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

# Writes to android/app/build/outputs/apk/release/
.PHONY: android-release
android-release :
			 ionic build
			 ionic capacitor copy android --prod
			 (cd android && gradle assembleRelease)

.PHONY: translate
translate :
			 python data/translate.py $(ARGS)

# make shuffle ARGS=text-id
.PHONY: shuffle
shuffle :
			 python data/shuffle.py $(ARGS)

.PHONY: test
test :
			 npm test -- a --watchAll=false $(ARGS)

.PHONY: test-args
test-args :
			 npm test -- --watchAll=false $(ARGS)

.PHONY: export-android-to-dropbox
export-android-to-dropbox :
			 cp android/app/build/outputs/apk/debug/app-debug.apk ~/Dropbox/tmp/
