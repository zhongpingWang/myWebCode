# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from . import models, views


def init_api(api):
    api.add_resource(views.StorageActionResource, '/storage/<string:action>')
