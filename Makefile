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
