"use strict";

const input = document.querySelector('#city_input');
const button = document.querySelector('#search_button');
const city_name = document.querySelector('#city_name');
const weather_img = document.querySelector('#weather_img');
const temp = document.querySelector('#temp');
const weather_description = document.querySelector('#weather_description');
const feels_like = document.querySelector('#feels_like');
const pressure = document.querySelector('#pressure');
const humidity = document.querySelector('#humidity');
const wind_speed = document.querySelector('#wind_speed');
const visibility = document.querySelector('#visibility');
const clouds = document.querySelector('#clouds');
const pol_value = document.querySelector('#pol_value');
const temp_table = document.querySelector('#temp_table');
const error_message = document.querySelector('#error_msg');
const pollution_info = document.querySelector('#pollution_info');
const pol_value_row = document.querySelector('.pol_row[pol-value]');
const API_key = 'bd3688d96163e380b40ed8d885f2b08b';
const weather_API = 'https://api.openweathermap.org/data/2.5/weather?q=';
const weather_info = document.querySelector('#weather_info');
const pollution_API = 'https://air-quality.p.rapidapi.com/current/airquality?lat=';
try{
    weather_info.style.display = "none";
    pollution_info.style.display = "none";
} catch(error){
    console.log(error);
}

async function getWeather(city) {
    console.log(city);
    let weather_data
    weather_data = await fetch(`${weather_API}${city}&appid=${API_key}&units=metric&lang=pl`);
    if(weather_data.status === 404) throw new Error("Wpisz poprawną nazwę miasta!");
    if(!weather_data?.ok) throw new Error("Błąd sieci!");
    weather_data = await weather_data.json();
    console.log(weather_data);
    console.log(`${weather_API}${city}&appid=${API_key}&units=metric&lang=pl`)
    showWeather(weather_data);
}

function showWeather(data){
    weather_info.style.display = "block";
    weather_img.src = ` https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
    city_name.textContent = data.name;
    temp.textContent = `${Math.round(data.main.temp)}\u00B0C`;
    weather_description.textContent = data.weather[0].description;
    feels_like.textContent = `${Math.round(data.main.feels_like)} \u00B0C`;
    pressure.textContent = `${data.main.pressure} hPa`;
    humidity.textContent = `${data.main.humidity} %`;
    wind_speed.textContent = `${data.wind.speed} m/s`;
    visibility.textContent = `${data.visibility / 1000} km`;
    clouds.textContent = `${data.clouds.all} %`;
    
}

async function getCorordinates(city){
    let {
        lat, lon
    } = (await (await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_key}`)).json())[0]
    return [lat, lon];
}
async function getPollution(lat, lon){
    let pollution_data = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_key}`)
        if(pollution_data.status === 404) throw new Error("Wpisz poprawną nazwę miasta!");
    if(!pollution_data?.ok) throw new Error("Błąd polączenia z API zanieczyszczeń!");
    pollution_info.style.display = "block";
    pollution_data = await pollution_data.json();
    console.log(pollution_data);
    pol_value.textContent = pollution_data.list[0].components.pm2_5;
    const pol_value_n = Math.floor(((pollution_data.list[0].components.pm2_5 - 10) / 25) + 1);
    setTimeout(() => {
        pol_value_row.setAttribute('pol-value', pol_value_n);
    });
}

button.addEventListener('click', async () => {
    error_message.textContent = "";
    try{
        if(input.value.length < 3){
        throw new Error("Krótka nazwa miasta!");
        }
        const city = input.value;
        await getWeather(city);
        await getPollution(...await getCorordinates(city));
    } catch(error){
        console.warn(error);
        error_message.textContent = error.message;
        [city_name, weather_img, temp, weather_description, feels_like, pressure, humidity, wind_speed, visibility, clouds].forEach(elem => elem.textContent = "");
        weather_info.style.display = "none";
        pollution_info.style.display = "none";
    }
    finally
    {
        input.value = "";
    }
});