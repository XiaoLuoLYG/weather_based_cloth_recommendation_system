console.log("main.js 文件加载成功");

const apiUrl = "/api";

async function fetchSuggestions(query) {
    try {
        console.log(`正在获取城市建议：${query}`);
        const response = await fetch(`${apiUrl}/autocomplete?query=${query}`);
        return await response.json();
    } catch (error) {
        console.error("获取城市建议失败:", error);
        return [];
    }
}

async function fetchWeather(city) {
    console.log(`正在获取天气信息：${city}`);
    const response = await fetch(`${apiUrl}/weather?city=${city}`);
    return await response.json();
}

async function fetchAdvice(weatherData) {
    console.log("正在获取穿衣建议", weatherData);
    const response = await fetch(`${apiUrl}/advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weatherData)
    });
    return await response.json();
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('city-input');
    const detectBtn = document.getElementById('detect-btn');
    const suggestionsBox = document.getElementById('suggestions');
    const resultBox = document.getElementById('result-box');
    const getAdviceBtn = document.getElementById('get-advice-btn');

    input.addEventListener('input', async () => {
        const query = input.value;
        const suggestions = await fetchSuggestions(query);
        suggestionsBox.innerHTML = suggestions.map(s => `<div>${s}</div>`).join('');
        suggestionsBox.style.display = suggestions.length ? 'block' : 'none';
    });

    suggestionsBox.addEventListener('click', (event) => {
        input.value = event.target.textContent;
        suggestionsBox.style.display = 'none';
    });

    detectBtn.addEventListener('click', async () => {
        const response = await fetch(`${apiUrl}/location`);
        const data = await response.json();
        input.value = data.city;
    });

    getAdviceBtn.addEventListener('click', async () => {
        const city = input.value;
        const weatherData = await fetchWeather(city);
        const advice = await fetchAdvice(weatherData);
        resultBox.innerHTML = `<p>${advice.advice}</p>`;
    });
});
