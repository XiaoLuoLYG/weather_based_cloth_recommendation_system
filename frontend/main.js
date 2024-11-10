console.log("main.js 文件加载成功");

const apiUrl = "/api";

async function fetchSuggestions(query) {
    console.log(`正在获取城市建议：${query}`);
    const response = await fetch(`${apiUrl}/autocomplete?query=${query}`);
    return await response.json();
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
    console.log("页面加载完成");
    
    const input = document.createElement('input');
    input.placeholder = "请输入城市名称...";
    document.body.appendChild(input);

    const resultBox = document.createElement('div');
    document.body.appendChild(resultBox);

    input.addEventListener('input', async () => {
        console.log(`输入城市名称：${input.value}`);
        const suggestions = await fetchSuggestions(input.value);
        resultBox.innerHTML = suggestions.map(s => `<div>${s}</div>`).join('');
    });

    input.addEventListener('change', async () => {
        console.log(`城市选择完成：${input.value}`);
        const weatherData = await fetchWeather(input.value);
        const advice = await fetchAdvice(weatherData);
        resultBox.innerHTML = `<p>${advice.advice}</p>`;
    });
});
