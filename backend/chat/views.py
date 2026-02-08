from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Conversation, Message
from .services.ai import translate_text, summarize_conversation
from django.db.models import Q

# Create your views here.


@api_view(["POST"])
def create_conversation(request):
    convo = Conversation.objects.create()
    return Response({"conversation_id": convo.id})


@api_view(["POST"])
def send_message(request):
    text = request.data.get("text")
    role = request.data.get("role")
    target_lang = request.data.get("target_language")
    convo_id = request.data.get("conversation_id")

    if not all([text, role, target_lang, convo_id]):
        return Response({"error": "Missing required fields"}, status=400)

    print("Incoming message:", text, role, target_lang, convo_id)

    try:
        translated = translate_text(text, target_lang)
    except Exception as e:
        print("AI ERROR:", e)
        translated = f"[DEV MODE – translation unavailable] {text}"

    msg = Message.objects.create(
        conversation_id=convo_id,
        role=role,
        original_text=text,
        translated_text=translated,
    )

    return Response({
        "id": str(msg.id),
        "translated": translated,
    })


@api_view(["POST"])
def generate_summary(request):
    convo_id = request.data.get("conversation_id")

    messages = Message.objects.filter(conversation_id=convo_id)

    texts = [m.original_text or "" for m in messages]

    summary = summarize_conversation(texts)

    return Response({"summary": summary})


@api_view(["POST"])
def upload_audio(request):
    file = request.FILES["audio"]
    role = request.POST.get("role")
    convo_id = request.POST.get("conversation_id")

    msg = Message.objects.create(
        conversation_id=convo_id,
        role=role,
        audio=file,
    )

    return Response({"audio_url": msg.audio.url})


@api_view(["GET"])
def search_messages(request):
    q = request.GET.get("q")

    results = Message.objects.filter(original_text__icontains=q)

    return Response(results.values())


@api_view(["GET"])
def get_messages(request, convo_id):
    messages = Message.objects.filter(
        conversation_id=convo_id
    ).order_by("created_at")

    data = [
        {
            "id": str(m.id),
            "role": m.role,
            "original": m.original_text,
            "translated": m.translated_text,
            "audio": m.audio.url if m.audio else None,
        }
        for m in messages
    ]

    return Response(data)


@api_view(["GET"])
def search_messages(request):
    q = request.GET.get("q")
    convo_id = request.GET.get("conversation_id")

    if not q or not convo_id:
        return Response([], status=200)

    results = Message.objects.filter(
        conversation_id=convo_id
    ).filter(
        Q(original_text__icontains=q) |
        Q(translated_text__icontains=q)
    ).order_by("created_at")

    data = [
        {
            "id": str(m.id),
            "role": m.role,
            "original": m.original_text,
            "translated": m.translated_text,
            "audio": m.audio.url if m.audio else None,
        }
        for m in results
    ]

    return Response(data)
