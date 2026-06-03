"""
AI-подбор тактического снаряжения TacticMind.
Принимает описание задачи пользователя и возвращает персональную подборку с обоснованием.
"""
import json
import os
from openai import OpenAI

BASE = "https://cdn.poehali.dev/projects/600da521-22fd-451e-8c82-59b152c1d165/bucket/"
FILES = "https://cdn.poehali.dev/projects/600da521-22fd-451e-8c82-59b152c1d165/files/"

CATALOG = [
    {"id": 1, "name": "Рюкзак ASSAULT PRO", "category": "Экипировка", "price": "8 490 ₽", "rating": 97,
     "image": FILES + "e36b36f6-28e7-40d1-b2b2-842f39d434ea.jpg",
     "specs": ["45 литров", "Кордура 1000D", "MOLLE", "IP65"],
     "description": "Штурмовой рюкзак 45л с системой MOLLE, водонепроницаемый, для переноски всего снаряжения"},
    {"id": 2, "name": "Мультитул FORCE-7", "category": "Инструменты", "price": "4 200 ₽", "rating": 94,
     "image": BASE + "96dc5ce3-8f11-4372-be4b-1cd59ac35678.jfif",
     "specs": ["19 функций", "Сталь 420HC", "156 гр", "25 лет гарантии"],
     "description": "Мультитул 19-в-1, нож, пила, плоскогубцы, отвёртки — незаменим в полевых условиях"},
    {"id": 3, "name": "Берцы GRUNT X2", "category": "Обувь", "price": "12 800 ₽", "rating": 91,
     "image": FILES + "b272a69e-e2fc-459d-92b6-1eedea70a0f9.jpg",
     "specs": ["Gore-Tex", "Vibram sole", "−40°C", "Тактический носок"],
     "description": "Тактические берцы Gore-Tex, подошва Vibram, до −40°C, для длительных маршей и сложной местности"},
    {"id": 4, "name": "Фонарь NIGHTHAWK", "category": "Свет", "price": "3 500 ₽", "rating": 89,
     "image": BASE + "2953445a-8c93-441d-9679-db9d682807e5.jfif",
     "specs": ["1000 люмен", "IP68", "5 режимов", "12ч работы"],
     "description": "Тактический фонарь 1000 люмен, IP68, 5 режимов, 12 часов работы в темноте"},
    {"id": 5, "name": "Перчатки IRONGRIP", "category": "Защита", "price": "2 800 ₽", "rating": 86,
     "image": BASE + "80599601-467c-4ff0-a082-1bfaca26acc9.jpeg",
     "specs": ["Кевлар", "Полупалец", "Антипорез", "XS-XXL"],
     "description": "Тактические перчатки с кевларовой защитой, антипорезные, защита рук при работе с острыми предметами"},
    {"id": 6, "name": "Бронежилет ГРАНИТ-4", "category": "Защита", "price": "54 990 ₽", "rating": 96,
     "image": BASE + "15627835-ccaa-420d-a5b5-545795b8dfda.jfif",
     "specs": ["Бр4", "9.2 кг", "Керамика", "ГОСТ"],
     "description": "Бронежилет класс Бр4, керамические пластины, защита от пуль и осколков"},
    {"id": 7, "name": "Шлем КИРАСА-Ш", "category": "Защита", "price": "23 490 ₽", "rating": 93,
     "image": BASE + "7df880cf-973e-423d-8b16-16bdc1b1f0d5.jfif",
     "specs": ["Бр3", "1.4 кг", "Титан", "NVG крепления"],
     "description": "Тактический шлем Бр3, лёгкий 1.4кг, крепления NVG, защита головы"},
    {"id": 8, "name": "Разгрузка МОЛОТ-М", "category": "Экипировка", "price": "18 990 ₽", "rating": 92,
     "image": BASE + "bf012edc-597b-4804-90ce-593a516786a0.jfif",
     "specs": ["8 карманов", "Быстросброс", "MOLLE", "Унисекс"],
     "description": "Тактическая разгрузка 8 карманов, быстрый сброс, размещение боеприпасов и снаряжения"},
    {"id": 9, "name": "Аптечка СТОП-КРОВЬ", "category": "Медицина", "price": "3 500 ₽", "rating": 98,
     "image": BASE + "6a0710c1-43ac-49bc-8b9d-91bdfbcde969.jpeg",
     "specs": ["Турникет", "Бандажи", "Гемостатик", "Инструкция"],
     "description": "Индивидуальная аптечка: турникет CAT Gen7, израильский бандаж, гемостатик — остановка кровотечения в первые минуты"},
    {"id": 10, "name": "Рация СВЯЗИСТ-ПРО", "category": "Средства связи", "price": "8 900 ₽", "rating": 88,
     "image": BASE + "56939487-ef18-4e44-9bae-f4e384d26dd6.jfif",
     "specs": ["10 км", "IP67", "Шифрование", "72 ч"],
     "description": "Тактическая рация, дальность 10км, шифрование, аккумулятор 72ч, связь с группой"},
    {"id": 11, "name": "Тактические очки HAWK", "category": "Защита", "price": "4 200 ₽", "rating": 87,
     "image": BASE + "a3c77c23-583f-4489-8908-cc36ee363540.jfif",
     "specs": ["Поляризация", "Ударопрочные", "UV400", "Антицарапин"],
     "description": "Тактические очки, защита от осколков, пыли и ветра, поляризованные линзы UV400"},
    {"id": 12, "name": "Накидка ЛЕСОВИК", "category": "Экипировка", "price": "5 900 ₽", "rating": 85,
     "image": BASE + "370789ba-565f-46c6-8135-cad26d3677bc.jfif",
     "specs": ["Лето/зима", "400 г", "Дышащий", "Унисекс"],
     "description": "Маскхалат для леса, имитирует лесную подстилку, дышащий, вес 400г, маскировка"},
    {"id": 13, "name": "Нож ВИТЯЗЬ", "category": "Инструменты", "price": "3 200 ₽", "rating": 90,
     "image": FILES + "8ea21448-585e-4cc6-8bdf-15653a06e9ca.jpg",
     "specs": ["Сталь 440C", "15 см", "Фиксация", "G10"],
     "description": "Тактический нож сталь 440C, клинок 15см, фиксированный, ножны MOLLE"},
    {"id": 14, "name": "Навигатор СТРАЖ-GPS", "category": "Инструменты", "price": "15 900 ₽", "rating": 84,
     "image": BASE + "4c10bb10-3a26-4db5-8912-362559b80d69.jpeg",
     "specs": ["GPS+ГЛОНАСС", "48 ч", "Карты РФ", "IP67"],
     "description": "GPS+ГЛОНАСС навигатор, карты РФ, 48ч батарея, работает без сотовой сети, ориентирование на местности"},
    {"id": 15, "name": "Куртка АРКТИК-М", "category": "Одежда", "price": "18 500 ₽", "rating": 93,
     "image": BASE + "c6701a38-5138-4f9f-aeee-26a30f137b7d.jpeg",
     "specs": ["Gore-Tex 3L", "−30°C", "Primaloft", "MOLLE рукав"],
     "description": "Зимняя тактическая куртка Gore-Tex, до −30°C, Primaloft, защита от мороза и влаги"},
    {"id": 16, "name": "Штаны СПЕЦНАЗ-ТК", "category": "Одежда", "price": "9 800 ₽", "rating": 88,
     "image": BASE + "29da3c37-2c2c-41a3-98a6-a5d110b22efb.jfif",
     "specs": ["Cordura накладки", "8 карманов", "Стрейч", "XS-4XL"],
     "description": "Тактические штаны с усилением Cordura на коленях, 8 карманов, свобода движения"},
    {"id": 17, "name": "Флис ТЕПЛОВОЙ-ПРО", "category": "Одежда", "price": "5 400 ₽", "rating": 86,
     "image": BASE + "b66948e6-9623-4171-a0a5-e1bb6ed9eec1.jpeg",
     "specs": ["300 г/м²", "Быстросохнущий", "Полная молния", "XS-XXXL"],
     "description": "Флисовая куртка 300г/м², быстросохнущий, средний слой для сохранения тепла"},
    {"id": 18, "name": "Пончо ПРИЗРАК", "category": "Одежда", "price": "3 200 ₽", "rating": 82,
     "image": BASE + "48fb43fe-2fda-4b82-a2eb-6d603b7690bf.jfif",
     "specs": ["Двусторонний", "320 г", "Камуфляж", "Универсальный"],
     "description": "Двустороннее маскировочное пончо: камуфляж/оливковый, защита от дождя, укрывает с рюкзаком"},
    {"id": 19, "name": "Гидропак ПОТОК-3Л", "category": "Питание и гидратация", "price": "2 900 ₽", "rating": 87,
     "image": BASE + "f9738a6a-1b60-4f27-85e7-6830cf70f90f.jfif",
     "specs": ["3 литра", "Антибактер.", "Клапан", "MOLLE"],
     "description": "Гидратационный рюкзак 3л, питьевая трубка, антибактериальное покрытие, для длительных маршей"},
    {"id": 20, "name": "Паёк СУТОЧНЫЙ-Б", "category": "Питание и гидратация", "price": "1 200 ₽", "rating": 80,
     "image": BASE + "79d085f9-2cb2-4f60-bd3b-f165d6832903.jpeg",
     "specs": ["3200 ккал", "5 блюд", "5 лет", "Без варки"],
     "description": "Суточный боевой паёк 3200 ккал, 5 приёмов пищи, не требует варки, срок хранения 5 лет"},
    {"id": 21, "name": "Котелок ПОЛЕВОЙ-Т", "category": "Питание и гидратация", "price": "1 800 ₽", "rating": 83,
     "image": BASE + "9a44d5f8-0493-4738-b2f5-04047328c794.jfif",
     "specs": ["1.2 л", "320 г", "Анод.алюминий", "Горелка"],
     "description": "Полевой котелок 1.2л + кружка + крышка-сковорода, анодированный алюминий, приготовление пищи"},
    {"id": 22, "name": "Гарнитура СКРЫТНИК-Х", "category": "Средства связи", "price": "12 500 ₽", "rating": 91,
     "image": BASE + "bddad1a5-3567-4500-8a8a-b6d510d87a49.jfif",
     "specs": ["22 дБ", "PTT", "Kenwood/Baofeng", "Шлем крепление"],
     "description": "Тактическая гарнитура, шумоподавление 22дБ, PTT-кнопка, совместима с рациями, крепление на шлем"},
    {"id": 23, "name": "Антенна ДАЛЬНИЙ-КВ", "category": "Средства связи", "price": "3 700 ₽", "rating": 79,
     "image": BASE + "656f2714-8ab8-4e88-b613-d847cbfb0892.jfif",
     "specs": ["SMA-F", "+60% дальность", "85 г", "VHF/UHF"],
     "description": "Усиленная антенна для рации, увеличивает дальность на 60%, SMA-F разъём, VHF/UHF"},
    {"id": 24, "name": "Аптечка ГРУППА-10", "category": "Медицина", "price": "8 900 ₽", "rating": 95,
     "image": BASE + "89f17704-24ce-4196-9928-58d7f713119d.jpeg",
     "specs": ["3 турникета", "10 бандажей", "NFAK", "Чемодан"],
     "description": "Групповая аптечка на 10 человек: 3 турникета, 10 бандажей, гемостатик, стандарт NFAK"},
    {"id": 25, "name": "Турникет ТАК-ПРО", "category": "Медицина", "price": "1 400 ₽", "rating": 92,
     "image": BASE + "23067a57-fbf3-4182-aa61-ff681fb7f73a.jpeg",
     "specs": ["1 рука", "25 сек", "ГОСТ", "Пластик"],
     "description": "Турникет одноручного наложения за 25 секунд, остановка артериального кровотечения конечностей"},
    {"id": 26, "name": "Повязка ХЕМОСТОП", "category": "Медицина", "price": "890 ₽", "rating": 88,
     "image": BASE + "66545456-0e86-4170-ae9e-8fd6f78a9559.jfif",
     "specs": ["Каолин", "3 минуты", "Стерильная", "5 лет"],
     "description": "Гемостатическая повязка с каолином, останавливает кровотечение за 3 минуты, для ран где турникет не применим"},
    {"id": 27, "name": "Лопатка САПЁР-М", "category": "Инструменты", "price": "2 600 ₽", "rating": 85,
     "image": BASE + "1c6cfc47-6ae6-4520-a32d-59a300ff187f.jfif",
     "specs": ["Сталь 65Г", "Пила", "520 г", "MOLLE чехол"],
     "description": "Сапёрная лопатка сталь 65Г, пила на обухе, складная, для земляных работ и разминирования"},
    {"id": 28, "name": "Мультитул ТЯЖЁЛЫЙ-19", "category": "Инструменты", "price": "6 800 ₽", "rating": 89,
     "image": BASE + "f0d212c7-6614-440c-bc95-c0edefb96348.jpg",
     "specs": ["Плоскогубцы", "Стропорез", "420HC", "G10 рукоять"],
     "description": "Тяжёлый мультитул с плоскогубцами, стропорезом, 19 функций, для серьёзных полевых задач"},
    {"id": 29, "name": "Пояс ШТУРМОВОЙ-Р", "category": "Экипировка", "price": "4 500 ₽", "rating": 87,
     "image": BASE + "57d0dd12-7128-4661-8a14-893231625b87.jfif",
     "specs": ["MOLLE", "45 мм", "Страховка", "Быстрая пряжка"],
     "description": "Тактический пояс MOLLE, 8 слотов, быстрая пряжка, сертифицирован для страховки"},
    {"id": 30, "name": "Чехол МУЛЬТИКАМ-ПТ", "category": "Экипировка", "price": "7 200 ₽", "rating": 84,
     "image": BASE + "c2209ca3-aa68-443a-baa0-e426c774b06e.jfif",
     "specs": ["Multicam", "Cordura 500D", "3 кармана", "Размеры S-XL"],
     "description": "Внешний чехол на бронежилет Multicam, Cordura 500D, 3 кармана для магазинов"},
]

SYSTEM_PROMPT = """Ты — экспертный AI-советник по тактическому снаряжению магазина TacticMind.
Твоя задача — провести глубокий анализ сценария пользователя и составить ПОЛНЫЙ комплект снаряжения.

Каталог товаров:
{catalog}

ПРИНЦИП СЦЕНАРНОГО АНАЛИЗА:
Думай как опытный тактический инструктор. Для каждого запроса определи:
1. Основная задача — что именно нужно делать
2. Сопутствующие риски — какие опасности возникают в этом сценарии
3. Условия — где, когда, как долго

ПРИМЕРЫ ЛОГИКИ:
- "медицина" → все медицинские товары: аптечки, турникеты, повязки (id: 9, 24, 25, 26)
- "разминирование полей" → лопатка сапёрная (работа), мультитул (инструмент), перчатки (защита рук), турникет + повязка (риск ранения), очки (защита глаз от осколков)
- "ночной патруль" → фонарь, рация, гарнитура, бронежилет, аптечка
- "длительный марш зимой" → куртка арктик, берцы, флис, гидропак, паёк, рюкзак
- "снайперская засада" → маскхалат, пончо, рюкзак, паёк, навигатор

ПРАВИЛА:
- Предлагай от 3 до 8 товаров — полный рабочий комплект, не один предмет
- Если запрос об одной категории (например "медицина") — предложи ВСЕ подходящие товары этой категории
- Всегда добавляй медицину если есть риск травм или опасных работ
- Учитывай совместимость и системность (MOLLE-системы сочетаются между собой)
- Для каждого товара давай конкретное обоснование применительно к сценарию (2 предложения)
- Отвечай строго в JSON-формате без лишнего текста

Формат ответа:
{{
  "intro": "Анализ сценария в 1-2 предложениях — что за задача и почему подобран именно такой комплект",
  "items": [
    {{
      "id": 1,
      "reason": "Конкретное обоснование для данного сценария"
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

    raw_body = event.get('body') or '{}'
    body = json.loads(raw_body) if isinstance(raw_body, str) else raw_body
    if isinstance(body, str):
        body = json.loads(body)
    task = body.get('task', '').strip()

    json_headers = {**cors_headers, 'Content-Type': 'application/json'}

    if not task:
        return {
            'statusCode': 400,
            'headers': json_headers,
            'body': json.dumps({'error': 'Опишите вашу задачу'}, ensure_ascii=False)
        }

    if len(task) < 3:
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
            {"role": "user", "content": f"Сценарий: {task}"},
        ],
        temperature=0.5,
        max_tokens=1500,
        response_format={"type": "json_object"},
    )

    ai_result = json.loads(response.choices[0].message.content)

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