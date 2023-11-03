function getWeather() {
    const city = document.getElementById("city").value; 
    const state = document.getElementById("state").value; 
    const country = document.getElementById("country").value; 
    const apiKey = 'e599ab3f002b94213c961270aa4b8708';
    const results = document.getElementById('weather-info');
    const searchedLocationsList = document.getElementById('searched-locations-list');

    // Retrieve existing searched locations from local storage
    const storedLocations = JSON.parse(localStorage.getItem('searchedLocations')) || [];

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=5&appid=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.length > 0) {
                const latitude = data[0].lat;
                const longitude = data[0].lon;

                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
                    .then((response) => response.json())
                    .then((weatherData) => {
                        const main = weatherData.main;
                        const tempKelvin = main.temp;
                        const tempFahrenheit = ((tempKelvin - 273.15) * 9/5) + 32; // Convert to Fahrenheit
                        const tempAsString = tempFahrenheit.toString()
                        const shortTemp = tempAsString.substring(0, 2);
                        
                        const weatherInfoHTML = `
                            <h2>Weather in ${city}, ${state}, ${country}</h2>
                            <p>Temperature: ${shortTemp}°F</p>
                            <p>Humidity: ${main.humidity}%</p>
                        `;
                        
                        results.innerHTML = weatherInfoHTML;

                        // Append the searched location to the list on the screen
                        const locationItem = document.createElement('li');
                        locationItem.textContent = `${city}, ${state}, ${country}`;
                        searchedLocationsList.appendChild(locationItem);

                        // Store the searched location in local storage
                        storedLocations.push(`${city}, ${state}, ${country}`);
                        localStorage.setItem('searchedLocations', JSON.stringify(storedLocations));
                    })
                    .catch((error) => {
                        console.error("Error fetching weather data:", error);
                    });
            } else {
                console.error("City not found");
                results.innerHTML = "<p>City not found</p>";
            }
        })
        .catch((error) => {
            console.error("Error fetching city coordinates:", error);
        });
}
