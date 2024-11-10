const apiUrl = "/api";

async function fetchSuggestions(query) {
    const response = await fetch(`${apiUrl}/autocomplete?query=${query}`);
    return await response.json();
}

async function fetchWeather(city) {
    const response = await fetch(`${apiUrl}/weather?city=${city}`);
    return await response.json();
}

async function fetchAdvice(weatherData) {
    const response = await fetch(`${apiUrl}/advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weatherData)
    });
    return await response.json();
}


document.addEventListener('DOMContentLoaded', () => {
    const input = document.createElement('input');
    input.placeholder = "请输入城市名称...";
    document.body.appendChild(input);

    const resultBox = document.createElement('div');
    document.body.appendChild(resultBox);

    input.addEventListener('input', async () => {
        const suggestions = await fetchSuggestions(input.value);
        resultBox.innerHTML = suggestions.map(s => `<div>${s}</div>`).join('');
    });

    input.addEventListener('change', async () => {
        const weatherData = await fetchWeather(input.value);
        const advice = await fetchAdvice(weatherData);
        resultBox.innerHTML = `<p>${advice.advice}</p>`;
    });
});
