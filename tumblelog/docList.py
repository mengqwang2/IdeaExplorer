from flask import current_app, flash, Blueprint, request, redirect, render_template, url_for
from flask.views import MethodView
from tumblelog.models import *
from flask.ext.mongoengine.wtf import model_form
import forms
from User import Users
from flask.ext.login import (current_user, login_required, login_user, logout_user, confirm_login, fresh_login_required)
from jinja2 import TemplateNotFound
from tumblelog import login_manager,flask_bcrypt
import logging,keywordSearch


class DocList(MethodView):
	def __init__(self,email):
		self.email=email

	def getKeywords(self):
		userObj=UserProfile.objects.get_or_404(email=self.email)
		return userObj.keyword

	def doRetrieveDoc(self,kwList):
		ks=keywordSearch.KeywordSearch(kwList)
		docList=ks.doSearch()
		return docList
