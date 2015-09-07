# -*- coding: utf-8 -*-
import os
from flask import request
from coalink.core.web import ActionResource

from . import storage


class StorageActionResource(ActionResource):
    def get(self, action):
        return self.done({"action": action})

    def upload(self):
        """
        @apiVersion 0.0.1
        @api {post} /api/storage/upload 上传文件
        @apiGroup Commons
        @apiParam {File} file 文件
        @apiSuccess {boolean} success 请求是否成功
        @apiSuccess {string} data 请求成功数据
        @apiSuccessExample {json} Success-Response
                                    {
                                        "success": true
                                        "data": {
                                            "id": 10,
                                            "mimetype": "image/jpeg",
                                            "name": "test.jpg",
                                            "size": 348988,
                                            "url": url
                                        },
                                    }
        @apiError {boolean} success 请求是否成功
        @apiError {string} message 请求错误信息
        """
        attach = storage.save(request.files['file'])
        return self.done(attach.to_dict())
