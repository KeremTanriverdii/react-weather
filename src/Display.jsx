import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Card, Button, InputGroup, Alert } from 'react-bootstrap'
import config from './assets/config.json'

function Display() {

    const [weatherData, setWeatherData] = useState(null);
    const [cityTarget, setCityTarger] = useState('');
    const [error, setError] = useState(null);

    const capitalizeWords = (str) => {
        return str
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const getWeatherImage = (iconCode, isDaytime) => {
        const baseURL = 'https://openweathermap.org/img/wn/';
        const iconType = isDaytime ? 'd' : 'n';
        return `${baseURL}${iconCode}@2x.png`.replace(/d|n$/, iconType);
    };

    const fetchData = async () => {
        const apiKey = config.apiKey;
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityTarget}&appid=${apiKey}&units=metric`)
            if (!response.ok) {
                console.log('Something is Wrong' + response.status);
            }
            const result = await response.json();
            if (result.cod !== 200) {
                setError('Şehir Bulunamadı');
                return;
            }
            const extractedData = {
                city: result.name,
                country: result.sys.country,

                description: capitalizeWords(result.weather[0].description),

                temp: result.main.temp,
                tempMax: result.main.temp_max,
                tempMin: result.main.temp_min,
                wind: result.wind.speed,

                icon: result.weather[0].icon,
                sunrise: result.sys.sunrise,
                sunset: result.sys.sunset

            };
            console.log(result);
            setWeatherData(extractedData);
            setError(null)
        } catch (err) {
            setError('Api is not a found');
            console.log('Error Not Connected' + err);
        }
    };

    const isDaytime = (sunrise, sunset) => {
        const now = Math.floor(Date.now() / 1000);
        return now > sunrise && now < sunset;
    };


    return (

        <Container >
            <Card className='container-card'>
                <Card.Title> Weather</Card.Title>
                <Card.Body>
                    <InputGroup>
                        <input type="text"
                            className='form-control'
                            placeholder="Search for a city"
                            aria-describedby="button-addon2"
                            value={cityTarget}
                            onChange={(e) => setCityTarger(e.target.value)}
                        />
                        <Button type="button"
                            className='btn btn-warning'
                            onClick={fetchData}
                        >Search</Button>
                    </InputGroup>
                    {error && <Alert className='mt-2 text-center' variant='danger'>
                        Please enter a valid city
                    </Alert>}
                    {weatherData &&
                        <Card className='weather-card mt-3'>
                            <div className='d-flex'>
                                <p className='ms-2 fs-1'>{Math.round(weatherData.temp)}°</p>
                                <img
                                    className="ms-auto"
                                    src={getWeatherImage(weatherData.icon, isDaytime(weatherData.sunrise, weatherData.sunset))}
                                    alt={weatherData.description}
                                />
                            </div>

                            <div className='d-flex ms-2 mt-4'>
                                <p>H:{Math.round(weatherData.tempMax)}°</p>
                                <p className='ms-2'>M:{Math.round(weatherData.tempMin)}°</p>
                                {/* <p className='ms-auto'>Wind:{weatherData.wind}</p> */}
                            </div>

                            <div className='d-flex ms-2'>
                                <p>{weatherData.city},</p>
                                <p className='ms-1'>{weatherData.country}</p>

                                <p className='ms-auto'>{weatherData.description}</p>
                            </div>
                        </Card>
                    }
                </Card.Body>
            </Card>
        </Container >
    )
}

export default Display