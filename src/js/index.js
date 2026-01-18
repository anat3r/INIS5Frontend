import '../styles/main.sass';

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
// Usunięto API_key, ponieważ Open-Meteo nie wymaga klucza
const weather_API = 'https://api.open-meteo.com/v1/forecast';
const weather_info = document.querySelector('#weather_info');
const pollution_API = 'https://air-quality-api.open-meteo.com/v1/air-quality';
try{
    weather_info.style.display = "none";
    pollution_info.style.display = "none";
} catch(error){
    console.log(error);
}

// Zaktualizowano do używania Nominatim dla geokodowania
async function getCoordinates(city){
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`);
    if (!response.ok) throw new Error("Błąd geokodowania!");
    const data = await response.json();
    if (data.length === 0) throw new Error("Wpisz poprawną nazwę miasta!");
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}

// Zaktualizowano do używania Open-Meteo dla pogody (wymaga lat/lon)
async function getWeather(city) {
    console.log(city);
    const [lat, lon] = await getCoordinates(city);
    const response = await fetch(`${weather_API}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,visibility,cloud_cover&timezone=auto&lang=pl`);
    if (!response.ok) throw new Error("Błąd sieci!");
    const data = await response.json();
    console.log(data);
    showWeather(data, city);
}

// Zaktualizowano showWeather do obsługi struktury danych Open-Meteo
function showWeather(data, cityName){
    weather_info.style.display = "block";
    // Open-Meteo używa kodów pogody, nie ikon. Musisz mapować kody na ikony (np. za pomocą biblioteki lub ręcznego mapowania)
    // Dla uproszczenia, używamy ikon z OpenWeatherMap jako zastępstwa
    const weatherCode = data.current_weather.weathercode;
    weather_img.src = `https://openweathermap.org/img/wn/${mapWeatherCodeToIcon(weatherCode)}.png`; // Zastępcze ikony OW
    city_name.textContent = cityName;
    temp.textContent = `${Math.round(data.current_weather.temperature)}\u00B0C`;
    // Open-Meteo nie dostarcza opisu bezpośrednio; przybliżamy na podstawie kodu
    weather_description.textContent = getWeatherDescription(weatherCode);
    // Temperatura odczuwalna nie jest bezpośrednio dostępna; używamy aktualnej temperatury jako przybliżenia
    feels_like.textContent = `${Math.round(data.current_weather.temperature)} \u00B0C`;
    // Używamy danych godzinowych dla innych pól (zakładając aktualną godzinę)
    const currentHour = new Date().getHours();
    pressure.textContent = `${Math.round(data.hourly.pressure_msl[currentHour])} hPa`;
    humidity.textContent = `${data.hourly.relative_humidity_2m[currentHour]} %`;
    wind_speed.textContent = `${data.hourly.wind_speed_10m[currentHour]} m/s`;
    visibility.textContent = `${data.hourly.visibility[currentHour] / 1000} km`;
    clouds.textContent = `${data.hourly.cloud_cover[currentHour]} %`;
}

// Funkcja pomocnicza do mapowania kodów pogody Open-Meteo na opisy (uproszczona)
function getWeatherDescription(code) {
    const descriptions = {
        0: 'Czyste niebo',
        1: 'Głównie słonecznie',
        2: 'Częściowo pochmurnie',
        3: 'Pochmurnie',
        45: 'Mgła',
        48: 'Osadzająca się mgiełka',
        51: 'Lekka mżawka',
        53: 'Umiarkowana mżawka',
        55: 'Gęsta mżawka',
        56: 'Lekka marznąca mżawka',
        57: 'Gęsta marznąca mżawka',
        61: 'Lekki deszcz',
        63: 'Umiarkowany deszcz',
        65: 'Gęsty deszcz',
        66: 'Lekki marznący deszcz',
        67: 'Gęsty marznący deszcz',
        71: 'Lekki śnieg',
        73: 'Umiarkowany śnieg',
        75: 'Gęsty śnieg',
        77: 'Ziarnisty śnieg',
        80: 'Lekkie przelotne opady',
        81: 'Umiarkowane przelotne opady',
        82: 'Gęste przelotne opady',
        85: 'Lekkie opady śniegu',
        86: 'Gęste opady śniegu',
        95: 'Burza',
        96: 'Burza z lekkim gradem',
        99: 'Burza z gęstym gradem'
    };
    return descriptions[code] || 'Nieznana pogoda';
}

// Funkcja pomocnicza do mapowania kodów na ikony (uproszczona; użyj pełnej biblioteki mapowania dla dokładności)
function mapWeatherCodeToIcon(code) {
    const icons = {
        0: '01d', // Czyste niebo
        1: '02d', // Głównie słonecznie
        2: '03d', // Częściowo pochmurnie
        3: '04d', // Pochmurnie
        45: '50d', // Mgła
        48: '50d', // Osadzająca się mgiełka
        51: '09d', // Lekka mżawka
        53: '09d', // Umiarkowana mżawka
        55: '09d', // Gęsta mżawka
        56: '13d', // Lekka marznąca mżawka
        57: '13d', // Gęsta marznąca mżawka
        61: '10d', // Lekki deszcz
        63: '10d', // Umiarkowany deszcz
        65: '10d', // Gęsty deszcz
        66: '13d', // Lekki marznący deszcz
        67: '13d', // Gęsty marznący deszcz
        71: '13d', // Lekki śnieg
        73: '13d', // Umiarkowany śnieg
        75: '13d', // Gęsty śnieg
        77: '13d', // Ziarnisty śnieg
        80: '09d', // Lekkie przelotne opady
        81: '09d', // Umiarkowane przelotne opady
        82: '09d', // Gęste przelotne opady
        85: '13d', // Lekkie opady śniegu
        86: '13d', // Gęste opady śniegu
        95: '11d', // Burza
        96: '11d', // Burza z lekkim gradem
        99: '11d'  // Burza z gęstym gradem
    };
    return icons[code] || '01d';
}

// Zaktualizowano do używania jakości powietrza Open-Meteo
async function getPollution(lat, lon){
    const response = await fetch(`${pollution_API}?latitude=${lat}&longitude=${lon}&hourly=pm2_5&timezone=auto`);
    if (!response.ok) throw new Error("Błąd połączenia z API zanieczyszczeń!");
    pollution_info.style.display = "block";
    const data = await response.json();
    console.log(data);
    const pm25 = data.hourly.pm2_5[0]; // Aktualna godzina
    pol_value.textContent = pm25.toString();
    const pol_value_n = Math.floor(((pm25 - 10) / 25) + 1);
    setTimeout(() => {
        pol_value_row.setAttribute('pol-value', pol_value_n);
    });
}

const capitalsList = document.querySelector('.capitals-list');
const countryCitiesList = document.querySelector('.country-cities-list');

// Lista głównych stolic
const capitals = ['Warszawa', 'Berlin', 'Paris', 'London', 'Madrid', 'Rome', 'Moscow', 'Tokyo', 'Beijing', 'Washington'];

// Funkcja do tworzenia karty szkieletowej (placeholder)
function createSkeletonCard() {
    const card = document.createElement('div');
    card.className = 'card skeleton';
    card.innerHTML = `
        <div class="skeleton-title"></div>
        <div class="skeleton-icon"></div>
        <div class="skeleton-content">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    `;
    return card;
}

// Zaktualizowano do obsługi struktury danych Open-Meteo
function createCard(cityData) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h4 class="card-title">${cityData.name}</h4>
        <img src="https://openweathermap.org/img/wn/${mapWeatherCodeToIcon(cityData.current_weather.weathercode)}.png" alt="ikona pogody" class="card-icon">
        <div class="card-content">
            <p>Temp: ${Math.round(cityData.current_weather.temperature)}°C</p>
            <p>Wilgotność: ${cityData.hourly.relative_humidity_2m[0]}%</p>
            <p>Wiatr: ${cityData.hourly.wind_speed_10m[0]} m/s</p>
            <p>Ciśnienie: ${Math.round(cityData.hourly.pressure_msl[0])} hPa</p>
            <p>${getWeatherDescription(cityData.current_weather.weathercode)}</p>
        </div>
    `;
    // Dodaj obsługę kliknięcia
    card.addEventListener('click', () => {
        input.value = cityData.name;
        button.click();
        document.querySelector('#search-section').scrollIntoView({ behavior: 'smooth' });
    });
    return card;
}

// Zaktualizowano do używania Nominatim dla odwrotnego geokodowania
async function getCountry(lat, lon) {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    if (!response.ok) throw new Error("Błąd odwrotnego geokodowania!");
    const data = await response.json();
    return data.address?.country_code?.toUpperCase(); // Zwraca kod kraju w wielkich literach, np. 'PL'
}

// Główne miasta według krajów (uproszczona lista)
const citiesByCountry = {
    'PL': ['Warszawa', 'Kraków', 'Gdańsk', 'Poznań', 'Wrocław'],
    'DE': ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt'],
    'FR': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
    'GB': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow'],
    'ES': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza'],
    'IT': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo'],
    'RU': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan'],
    'JP': ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo'],
    'CN': ['Beijing', 'Shanghai', 'Shenzhen', 'Guangzhou', 'Chengdu'],
    'US': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']
};

// Ładowanie danych przy starcie
window.addEventListener('load', async () => {
    try {
        // Pobieranie geolokalizacji
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;
        const country = await getCountry(latitude, longitude);
        
        // Stworzenie kart szkieletowych dla stolic i dodanie ich natychmiast
        const capitalCards = capitals.map(() => {
            const skeleton = createSkeletonCard();
            capitalsList.appendChild(skeleton);
            return skeleton;
        });
        
        // Stworzenie kart szkieletowych dla miast kraju i dodanie ich natychmiast
        const countryCities = citiesByCountry[country] || ['Warszawa', 'Kraków']; // Domyślne
        const countryCards = countryCities.map(() => {
            const skeleton = createSkeletonCard();
            countryCitiesList.appendChild(skeleton);
            return skeleton;
        });
        
        // Aktualizacja kart stolic po pobraniu danych
        for (let i = 0; i < capitals.length; i++) {
            const city = capitals[i];
            try {
                const [lat, lon] = await getCoordinates(city);
                const response = await fetch(`${weather_API}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m&timezone=auto`);
                if (!response.ok) throw new Error(`Błąd dla ${city}`);
                const data = await response.json();
                const card = createCard({ ...data, name: city });
                capitalsList.replaceChild(card, capitalCards[i]);
                // Opóźnienie, aby przestrzegać limitów Nominatim (1 żądanie na sekundę)
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Błąd dla ${city}:`, error);
                // W przypadku błędu, usuń kartę szkieletową lub zostaw pustą
                capitalsList.removeChild(capitalCards[i]);
            }
        }
        
        // Aktualizacja kart miast kraju po pobraniu danych
        for (let i = 0; i < countryCities.length; i++) {
            const city = countryCities[i];
            try {
                const [lat, lon] = await getCoordinates(city);
                const response = await fetch(`${weather_API}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m&timezone=auto`);
                if (!response.ok) throw new Error(`Błąd dla ${city}`);
                const data = await response.json();
                const card = createCard({ ...data, name: city });
                countryCitiesList.replaceChild(card, countryCards[i]);
                // Opóźnienie, aby przestrzegać limitów Nominatim (1 żądanie na sekundę)
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Błąd dla ${city}:`, error);
                // W przypadku błędu, usuń kartę szkieletową lub zostaw pustą
                countryCitiesList.removeChild(countryCards[i]);
            }
        }
    } catch (error) {
        console.error('Błąd ładowania danych:', error);
    }
});

button.addEventListener('click', async () => {
    error_message.textContent = "";
    try{
        if(input.value.length < 3){
        throw new Error("Krótka nazwa miasta!");
        }
        const city = input.value;
        const [lat, lon] = await getCoordinates(city);
        await getWeather(city);
        await getPollution(lat, lon);
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