"""
AI-подбор тактического снаряжения TacticMind.
Принимает описание задачи пользователя и возвращает персональную подборку с обоснованием.
"""
import json
import os
from openai import OpenAI

CATALOG = [
    {"id": 1, "name": "Рюкзак ASSAULT PRO", "category": "Экипировка", "price": "8 490 ₽", "rating": 97,
     "image": "https://cdn.poehali.dev/projects/600da521-22fd-451e-8c82-59b152c1d165/files/e36b36f6-28e7-40d1-b2b2-842f39d434ea.jpg",
     "specs": ["45 литров", "Кордура 1000D", "MOLLE", "IP65"],
     "description": "Штурмовой рюкзак 45л с системой MOLLE, водонепроницаемый, вес 1.8кг"},
    {"id": 2, "name": "Мультитул FORCE-7", "category": "Инструменты", "price": "4 200 ₽", "rating": 94,
     "image": "https://cdn.poehali.dev/projects/600da521-22fd-451e-8c82-59b152c1d165/files/8ea21448-585e-4cc6-8bdf-15653a06e9ca.jpg",
     "specs": ["19 функций", "Сталь 420HC", "156 гр", "25 лет гарантии"],
     "description": "Мультитул 19-в-1 из нержавеющей стали 420HC, вес 156г, гарантия 25 лет"},
    {"id": 3, "name": "Берцы GRUNT X2", "category": "Обувь", "price": "12 800 ₽", "rating": 91,
     "image": "https://cdn.poehali.dev/projects/600da521-22fd-451e-8c82-59b152c1d165/files/b272a69e-e2fc-459d-92b6-1eedea70a0f9.jpg",
     "specs": ["Gore-Tex", "Vibram sole", "−40°C", "Тактический носок"],
     "description": "Тактические берцы Gore-Tex, подошва Vibram, до −40°C, усиленный носок"},
    {"id": 4, "name": "Фонарь NIGHTHAWK", "category": "Свет", "price": "3 600 ₽", "rating": 89,
     "image": "https://cdn.poehali.dev/projects/600da521-22fd-451e-8c82-59b152c1d165/files/e36b36f6-28e7-40d1-b2b2-842f39d434ea.jpg",
     "specs": ["1200 люмен", "IP68", "5 режимов", "12ч работы"],
     "description": "Тактический фонарь 1200 люмен, водозащита IP68, 5 режимов, 12 часов работы"},
    {"id": 5, "name": "Перчатки IRONGRIP", "category": "Защита", "price": "2 900 ₽", "rating": 86,
     "image": "https://cdn.poehali.dev/projects/600da521-22fd-451e-8c82-59b152c1d165/files/b272a69e-e2fc-459d-92b6-1eedea70a0f9.jpg",
     "specs": ["Кевлар", "Полупалец", "Антипорез", "XS-XXL"],
     "description": "Тактические перчатки с кевларовой защитой, антипорезные, полупалец"},
]

SYSTEM_PROMPT = """Ты — AI-советник по тактическому снаряжению в магазине TacticMind.
Пользователь описывает свою задачу, а ты подбираешь 1-3 позиции из каталога и объясняешь, почему именно они.

Каталог доступных товаров:
{catalog}

Правила:
- Подбирай только из каталога (используй id товаров)
- Для каждого товара давай конкретное обоснование (2-3 предложения) применительно к задаче пользователя
- Отвечай строго в JSON-формате без лишнего текста

Формат ответа:
{{
  "intro": "Краткое вступление (1 предложение о задаче)",
  "items": [
    {{
      "id": 1,
      "reason": "Конкретное обоснование почему этот товар подходит для задачи"
    }}
  ]
}}"""


def handler(event: dict, context) -> dict:
    """AI-подбор тактического снаряжения по описанию задачи пользователя."""
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': cors_headers, 'body': json.dumps({'error': 'Method not allowed'})}

    body = json.loads(event.get('body') or '{}')
    task = body.get('task', '').strip()

    json_headers = {**cors_headers, 'Content-Type': 'application/json'}

    if not task:
        return {
            'statusCode': 400,
            'headers': json_headers,
            'body': json.dumps({'error': 'Опишите вашу задачу'}, ensure_ascii=False)
        }

    if len(task) < 10:
        return {
            'statusCode': 400,
            'headers': json_headers,
            'body': json.dumps({'error': 'Слишком короткое описание. Расскажите подробнее о задаче.'}, ensure_ascii=False)
        }

    catalog_text = "\n".join([
        f"- id={p['id']}, название: {p['name']}, категория: {p['category']}, цена: {p['price']}, описание: {p['description']}"
        for p in CATALOG
    ])

    client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT.format(catalog=catalog_text)},
            {"role": "user", "content": f"Моя задача: {task}"},
        ],
        temperature=0.7,
        max_tokens=800,
        response_format={"type": "json_object"},
    )

    ai_result = json.loads(response.choices[0].message.content)

    selected_ids = {item["id"] for item in ai_result.get("items", [])}
    catalog_map = {p["id"]: p for p in CATALOG}

    result_items = []
    for ai_item in ai_result.get("items", []):
        product = catalog_map.get(ai_item["id"])
        if product:
            result_items.append({
                **product,
                "aiReason": ai_item["reason"],
            })

    return {
        'statusCode': 200,
        'headers': {**cors_headers, 'Content-Type': 'application/json'},
        'body': json.dumps({
            'intro': ai_result.get('intro', ''),
            'items': result_items,
        }, ensure_ascii=False)
    }