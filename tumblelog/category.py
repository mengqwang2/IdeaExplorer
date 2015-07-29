import os,sys,operator
import dataParse
from flask import current_app, flash, Blueprint, request, redirect, render_template, url_for
from flask.views import MethodView
from tumblelog import models
from tumblelog.models import *
from flask.ext.mongoengine.wtf import model_form
import forms
from User import Users
from flask.ext.login import (current_user, login_required, login_user, logout_user, confirm_login, fresh_login_required)
from jinja2 import TemplateNotFound
from tumblelog import login_manager,flask_bcrypt
import logging

class Category():
	def __init__(self,k):
		self.__td=TagDoc.objects.all()
		self.__K=k

	def getPopTags(self):
		tag_doc=dict()
		for tdObj in self.__td:
			tag_doc[tdObj.tag]=len(tdObj.docid)

		td_sorted=sorted(tag_doc.items(),key=operator.itemgetter(1),reverse=True)
		print td_sorted
