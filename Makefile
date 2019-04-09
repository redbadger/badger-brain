keyrings: ## Initialize blackbox secrets in the keyrings folder
	git clone git@github.com:redbadger/blackbox-secrets.git keyrings -b badger-brain
	@echo ""
	@echo "*************************************************************"
	@echo "* Follow the instructions to get added to the blackbox admins:"
	@echo "* https://github.com/redbadger/blackbox-secrets/blob/master/README.md"
	@echo "*************************************************************"
	@echo ""
	@read -p "Press any key to continue."

update-secrets: keyrings ## Update secrets to latest version
	cd keyrings \
	&& git pull
	blackbox_edit_start keyrings/files/.env
	mv keyrings/files/.env .env

edit-secrets: keyrings update-secrets ## Edit secret file (get latest -> decrypt -> edit -> encrypt -> push)
	blackbox_edit keyrings/files/.env
	cd keyrings \
	&& git commit -m "files/.env.gpg updated" "files/.env.gpg" \
	&& git push origin badger-brain
	blackbox_edit_start keyrings/files/.env
	mv keyrings/files/.env .env

scanner: ## Initialize git secrets in the scanner folder
	git clone git@github.com:redbadger/secrets-scanner.git scanner
	@echo ""
	@echo "*************************************************************"
	@echo "* Follow the instructions to get added to the setup the scanner:"
	@echo "* https://github.com/redbadger/secrets-scanner/blob/master/README.md"
	@echo "*************************************************************"
	@echo ""
	@read -p "Press any key to continue."

setup-scanner: scanner ## Setup git secrets with stored configuration
	@cd scanner && git pull
	@cd scanner && $(MAKE) full-setup

scan-secrets: scanner ## Scan for secrets
	@git secrets --scan