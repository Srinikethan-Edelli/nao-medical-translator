from django.db import models
import uuid
from django.db import models

# Create your models here.

class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages"
    )


    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    role = models.CharField(max_length=20)

    original_text = models.TextField(null=True, blank=True)
    translated_text = models.TextField(null=True, blank=True)

    audio = models.FileField(upload_to='audio/', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
