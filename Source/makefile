PREFIX=~
MESODIR=/.meso

install:
	mkdir -p $(PREFIX)$(MESODIR)
	cp -Rf ./bin $(PREFIX)$(MESODIR)/bin
	cp -Rf ./engines $(PREFIX)$(MESODIR)/engines
	cp -Rf ./lib $(PREFIX)$(MESODIR)/lib
	cp -Rf ./vendor $(PREFIX)$(MESODIR)/vendor
	@echo "Done!"
	@echo "---"
	@echo "Make sure to add $(PREFIX)$(MESODIR)/bin to your PATH."

uninstall:
	rm -Rf $(PREFIX)$(MESODIR)/bin
	rm -Rf $(PREFIX)$(MESODIR)/engines
	rm -Rf $(PREFIX)$(MESODIR)/lib
	rm -Rf $(PREFIX)$(MESODIR)/vendor
	rm -Rf $(PREFIX)$(MESODIR)
	@echo "Done"

clean: uninstall
