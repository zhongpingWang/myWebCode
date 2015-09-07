#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os

from flask.ext.script import Manager
from flask.ext.migrate import MigrateCommand, Migrate
from coalink import create_app, db

app = create_app(os.getenv('FLASK_CONFIG') or 'default')
manager = Manager(app)
migrate = Migrate(app, db)

manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
