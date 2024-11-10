import requests
from flask import Flask, request, jsonify
import openai
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# API 配置
import os
# from dotenv import load_dotenv

# load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
print(OPENWEATHER_API_KEY, OPENAI_API_KEY)
openai.api_key = OPENAI_API_KEY

# 根路径
@app.route('/')
def index():
    return "API is running. Use /api endpoints."

# 自动补全城市
@app.route('/api/autocomplete', methods=['GET'])
def autocomplete():
    query = request.args.get('query')
    url = f"https://api.openweathermap.org/geo/1.0/direct?q={query}&limit=5&appid={OPENWEATHER_API_KEY}"
    response = requests.get(url)
    suggestions = [f"{city['name']}, {city['country']}" for city in response.json()]
    return jsonify(suggestions)

# 获取天气信息
@app.route('/api/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric&lang=zh_cn"
    response = requests.get(url)
    data = response.json()
    return jsonify({
        "current_temp": data["main"]["temp"],
        "feels_like": data["main"]["feels_like"],
        "temp_min": data["main"]["temp_min"],
        "temp_max": data["main"]["temp_max"],
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"],
        "description": data["weather"][0]["description"]
    })

# 生成穿衣建议
@app.route('/api/advice', methods=['POST'])
def generate_advice():
    weather_data = request.json
    prompt = f"""
    当前天气情况：
    - 当前温度：{weather_data['current_temp']}°C
    - 体感温度：{weather_data['feels_like']}°C
    - 风速：{weather_data['wind_speed']} km/h
    - 湿度：{weather_data['humidity']}%
    - 天气描述：{weather_data['description']}
    - 今天最高温度：{weather_data['temp_max']}°C
    - 今天最低温度：{weather_data['temp_min']}°C
    请给出详细的穿衣建议。
    """
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return jsonify({"advice": response['choices'][0]['message']['content']})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)