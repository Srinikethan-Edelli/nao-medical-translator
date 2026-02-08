from django.urls import path
from . import views

urlpatterns = [
    path("conversation/", views.create_conversation),
    path("message/", views.send_message),
    path("summary/", views.generate_summary),
    path("audio/", views.upload_audio),
    path("search/", views.search_messages),
    path("messages/<uuid:convo_id>/", views.get_messages),

]