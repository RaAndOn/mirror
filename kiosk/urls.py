from django.conf.urls import url

from . import views

app_name = 'kiosk'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^(?P<message_id>[0-9]+)/$', views.detail, name='detail')
]