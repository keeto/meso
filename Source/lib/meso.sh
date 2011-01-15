#!/bin/bash

# [meso]
# Meso in the Middle (v0.1.0)
# http://github.com/keeto/meso
#
# Copyright 2010, Mark Obcena <keetology.com>
# Released under an MIT-Style License
#

# Options
MESO_DIR="$(dirname $0)/.."		# Directory of the runner
MESO_LIB="$MESO_DIR/lib/"		# Directory of the library
MESO_ADP="$MESO_DIR/engines/"	# Directory of the engine adapters

MESO_TARGET=					# Target Engine
MESO_ENGINES=					# Space separated string of supported engines
MESO_SILENT=0					# Run in silent mode
MESO_BOOTSTRAP=1				# Bootstrap engine


# meso_load_config()
#	Loads the user's .mesorc that overrides any default options
meso_load_config(){
	if [[ -f "$HOME/.mesorc" ]]; then
		. "$HOME/.mesorc"
	fi

	for engine in $MESO_ENGINES
	do
		if [[ -n `which $engine` ]]; then
			MESO_TARGET=$engine
			break
		fi
	done
}


# meso_check_engines()
#	Checks whether the engine in use has a bootstrapper
meso_check_engines(){
	if [[ -z "$MESO_TARGET" ]]; then
		echo "meso: No engine set. Set 'MESO_ENGINES' in your .mesorc or pass an engine name using the -e option" >&2
		exit
	fi
	if [[ ! -d "$MESO_ADP$MESO_TARGET" ]]; then
		MESO_BOOTSTRAP=0
		if [[ $MESO_SILENT -ne 1 ]]; then
			echo "meso: No adapter available for the engine named '$MESO_TARGET'. Engine object will not be exported." >&2
		fi
	fi
	if [[ -z `which $MESO_TARGET` ]]; then
		echo "meso: No executable available for the engine '$MESO_TARGET' in your system." >&2
		exit
	fi
}

# meso_execute_script()
#	Executes the script in the target engine
meso_execute_script(){
	if [[ $MESO_BOOTSTRAP -ne 0 ]]; then
		$MESO_TARGET "$MESO_ADP$MESO_TARGET/bootstrap.js" $ARGS
	else
		$MESO_TARGET $ARGS
	fi
}
