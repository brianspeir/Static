#
# Copyright (C) 2014 Brian Speir. All rights reserved.
#
# Licensed under The BSD 3-Clause License (the "License"); you may not
# use this file except in compliance with the License. You may obtain
# a copy of the License at http://opensource.org/licenses/BSD-3-Clause.
#
#

# static.Makefile
#
# Write a one line summary here...
#
# And a longer description including the modules and subpackages exported
# by this package should go here. The maximum line length for doctrings or
# comments is limted to 72 characters.
#
#


clean:
	@grunt clean:all

deploy:
	@grunt deploy

develop:
	@grunt develop

init:
	@npm install
	@npm install image-min
	@npm install gifsicle
	@npm install jpegtran-bin
	@sed -i .bak 's/config = c.process(filepath, grunt.config())/config = c.process(filepath, grunt.config)/' node_modules/grunt-usemin/tasks/usemin.js

stage:
	@grunt stage

update:
	@npm update
	@sed -i .bak 's/config = c.process(filepath, grunt.config())/config = c.process(filepath, grunt.config)/' node_modules/grunt-usemin/tasks/usemin.js

validate:
	@grunt validation
