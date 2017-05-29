# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.template import loader
# Create your views here.
from django.http import HttpResponse
from .models import Message


def index(request):
    latest_message_list = Message.objects.order_by('-creation_date')[:5]
    template = loader.get_template('kiosk/index.html')
    context = {'latest_message_list': latest_message_list,}
    # return HttpResponse(template.render(context, request))
    return render(request, 'kiosk/index.html', context)

def detail(request, message_id):
    try:
        message = Message.objects.get(pk=message_id)
    except Message.DoesNotExist:
        raise Http404("Message does not exist")
    return render(request, 'kiosk/detail.html', {'message': message})