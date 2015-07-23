from flask import current_app, flash, Blueprint, request, redirect, render_template, url_for
from flask.views import MethodView
from tumblelog.models import *
from flask.ext.mongoengine.wtf import model_form
import forms
from User import Users
from flask.ext.login import (current_user, login_required, login_user, logout_user, confirm_login, fresh_login_required)
from jinja2 import TemplateNotFound
from tumblelog import login_manager,flask_bcrypt
import logging


class Login(MethodView):
	def __init__(self,email,password):
		self.email=email
		self.password=password

	def doLogin(self):
		email=self.email
		userObj=Users()
		user = userObj.get_by_email_w_password(email)
		if user and self.password==user.password and user.is_active():
			return "Login successfully"
		return "Login failed"