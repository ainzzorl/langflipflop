.PHONY: verify
verify : lint test
			 
.PHONY: build-website
build-website :
			 ionic build --engine=browser

.PHONY: fix
fix :
			 npx prettier --write .

.PHONY: lint-ts
lint-ts :
			 npx eslint src/
			 npx prettier -c src/

.PHONY: lint-python
lint-python :
			 pylint data-scripts

.PHONY: lint
lint : lint-ts lint-python

.PHONY: serve
serve :
			 ionic serve --no-open

.PHONY: import-texts
import-texts :
			 python data-scripts/import.py

.PHONY: android
android :
			 ionic build
			 ionic capacitor copy android
			 (cd android && gradle installDebug)

.PHONY: android-deploy
android-deploy :
			 (cd android && gradle installDebug)

# Writes to android/app/build/outputs/apk/release/
.PHONY: android-release-signed
android-release-signed :
			 ionic build
			 ionic capacitor copy --prod android
			 (cd android && gradle assembleRelease -Pandroid.injected.signing.store.file="$(KEYFILE)" -Pandroid.injected.signing.store.password="$(STORE_PASSWORD)" -Pandroid.injected.signing.key.alias="$(KEY_ALIAS)" -Pandroid.injected.signing.key.password="$(KEY_PASSWORD)")

# Writes to android/app/build/outputs/apk/release/
.PHONY: android-release-unsigned
android-release-unsigned :
			 ionic build
			 ionic capacitor copy --prod android
			 (cd android && gradle assembleRelease)

.PHONY: translate
translate :
			 python data-scripts/translate.py $(ARGS)

# make shuffle ARGS=text-id
.PHONY: shuffle
shuffle :
			 python data-scripts/shuffle.py $(ARGS)

.PHONY: test
test :
			 npm test -- a --watchAll=false $(ARGS)

# E.g.
# make test-args ARGS=src/__tests__/pages/TextPage.test.tsx
.PHONY: test-args
test-args :
			 npm test -- --watchAll=false $(ARGS)

.PHONY: test-library-page
test-library-page :
			 npm test -- --watchAll=false src/__tests__/pages/LibraryPage.test.tsx

.PHONY: test-recent-page
test-recent-page :
			 npm test -- --watchAll=false src/__tests__/pages/RecentPage.test.tsx

.PHONY: test-text-info-page
test-text-info-page :
			 npm test -- --watchAll=false src/__tests__/pages/TextInfoPage.test.tsx

.PHONY: test-text-page
test-text-page :
			 npm test -- --watchAll=false src/__tests__/pages/TextPage.test.tsx

.PHONY: test-settings-page
test-settings-page :
			 npm test -- --watchAll=false src/__tests__/pages/SettingsPage.test.tsx

.PHONY: test-about-page
test-about-page :
			 npm test -- --watchAll=false src/__tests__/pages/AboutPage.test.tsx

.PHONY: test-ftue
test-ftue :
			 npm test -- --watchAll=false src/__tests__/pages/Ftue.test.tsx

.PHONY: test-interface-language
test-interface-language :
			 npm test -- --watchAll=false src/__tests__/InterfaceLanguage.test.tsx

.PHONY: export-android-to-dropbox
export-android-to-dropbox :
			 cp android/app/build/outputs/apk/debug/app-debug.apk ~/Dropbox/tmp/

.PHONY: generate-android-splash
generate-android-splash :
			 cordova-res android --type splash --fit contain --copy

.PHONY: clean
clean:
			 rm -rf build/
			 rm -rf android/build/
			 rm -rf android/app/build/
			 rm -rf android/app/release/

.PHONY: deploy-website-cfn-alpha
deploy-website-cfn-alpha :
			 python aws/deploy-cfn.py alpha

.PHONY: deploy-website-content-alpha
deploy-website-content-alpha : build-website
			 python aws/deploy-content.py alpha

.PHONY: deploy-website-alpha
deploy-website-alpha : deploy-website-cfn-alpha deploy-website-content-alpha

.PHONY: deploy-website-cfn-prod
deploy-website-cfn-prod :
			 python aws/deploy-cfn.py prod

.PHONY: deploy-website-content-prod
deploy-website-content-prod : build-website
			 python aws/deploy-content.py prod

.PHONY: deploy-website-prod
deploy-website-prod : deploy-website-cfn-prod deploy-website-content-prod
