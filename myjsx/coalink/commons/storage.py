# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import datetime
import tempfile
import os
import uuid
from coalink import db
from oss.oss_api import OssAPI
from .models import Attachment

host = "oss-cn-qingdao.aliyuncs.com"
bucket_name = 'coalink'
timeout = 60
oss = OssAPI(host, "hwzCyhW9BssRwb8h", "6j0rrgyPKLNRx8oHgIbC4b9rw9vJmo")


def save(f):
    now = datetime.datetime.now()
    file_id = str(uuid.uuid4())
    object_name = now.strftime("file/%Y/%m/%d/") + str(uuid.uuid4())
    temppath = os.path.join(tempfile.gettempdir(), file_id)
    f.save(temppath)

    mimetype = f.mimetype
    oss.put_object_from_file(bucket_name, object_name, temppath, content_type=mimetype)

    attach = Attachment()
    attach.name = f.filename
    attach.url = sign_url(object_name)
    attach.key = object_name
    attach.mimetype = mimetype
    attach.date_expired = now + datetime.timedelta(minutes=timeout)
    attach.server = host
    attach.size = os.path.getsize(temppath)

    db.session.add(attach)
    db.session.commit()

    return attach


def sign_url(object_name):
    return oss.sign_url("GET", bucket_name, object_name, timeout=timeout, headers=None, params=None)


def refresh_url(attach):
    attach.url = sign_url(bucket_name, attach.key)
    db.session.commit()
