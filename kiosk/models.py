# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import datetime
from django.utils import timezone


# Create your models here.
class Message(models.Model):
	message_text = models.CharField(max_length=200)
	creation_date = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.message_text

	def was_created_recently(self):
		return self.creation_date >= timezone.now() - datetime.timedelta(days=1)

class Background(models.Model):
	image = models.ImageField(upload_to='backgrounds/')
	upload_date = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.upload_date

	def was_uploaded_recently(self):
		return self.upload_date >= timezone.now() - datetime.timedelta(days=1)