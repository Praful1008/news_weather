const express = require("express");
const https = require("https");
const path = require("path");
const hbs = require('hbs');
const bodyParser = require('body-parser');
const templatePath = path.join(__dirname, 'templates/views');
const partialsPath = path.join(__dirname, 'templates/partials');

const port = process.env.PORT || 3000;

require('dotenv').config();

const app = express();

app.set('view engine', 'hbs');

app.set('views', templatePath);
hbs.registerPartials(partialsPath);

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.render('index', {
        nav: 'Home'
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        nav: 'About'
    });
})

app.get("/weather", (req, res) => {
    const apiKey = process.env.weather_API_KEY;
    const cityName = 'Delhi';
    let wData = "";
    https.get(`https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${cityName}&units=metric`, (response) => {
        if (response.statusCode === 404)
            res.send('error in weather page');
        else {
            response.on("data", (chunk) => {
                wData += chunk;
            })
            response.on('end', async () => {
                const weatherData = await JSON.parse(wData);
                res.render('weather', {
                    temp: weatherData.main.temp,
                    description: weatherData.weather[0].description,
                    icon: weatherData.weather[0].icon,
                    city: cityName,
                    country: weatherData.sys.country,
                    humidity: weatherData.main.humidity,
                    nav: 'Weather',
                    error: false
                })
            })
        }
    }).on('error', (e) => {
        res.render('404page')
    })
})

app.post("/weather", (req, res) => {
    const apiKey = process.env.weather_API_KEY;
    const searchBy = req.body.searchBy;
    const cityName = req.body.cityName;
    const lat = req.body.lat;
    const long = req.body.long;
    if (searchBy === 'cityName') {
        https.get(`https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${cityName}&units=metric`, (response) => {
            if (response.statusCode === 404) {
                res.render('weather', {
                    nav: 'Weather',
                    error: true,
                    category: "cityName"
                });
            }
            else {
                let wData = '';

                response.on('data', (chunk) => {
                    wData += chunk;
                })
                response.on('end', async () => {
                    const weatherData = await JSON.parse(wData);
                    res.render('weather', {
                        temp: weatherData.main.temp,
                        description: weatherData.weather[0].description,
                        icon: weatherData.weather[0].icon,
                        city: cityName,
                        country: weatherData.sys.country,
                        humidity: weatherData.main.humidity,
                        nav: 'Weather',
                        category: "cityName",
                        error: false
                    })
                })
            }
        })
    }
    else {
        https.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`
            , (response) => {
                if (response.statusCode === 400) {
                    res.render('weather', {
                        nav: 'Weather',
                        error: true,
                        category: "lat_long"
                    });
                }
                else {
                    let wData = '';
                    response.on('data', chunk => wData += chunk);
                    response.on('end', async () => {
                        const weatherData = await JSON.parse(wData);
                        if (weatherData.name === '') {
                            weatherData.name = 'unknown';
                        }
                        res.render('weather', {
                            temp: weatherData.main.temp,
                            description: weatherData.weather[0].description,
                            icon: weatherData.weather[0].icon,
                            city: weatherData.name,
                            country: weatherData.sys.country,
                            humidity: weatherData.main.humidity,
                            nav: 'Weather',
                            category: "lat_long",
                            error: false
                        })
                    })
                }
            })
    }
})

app.get("/news", (req, res) => {
    const apiKey = process.env.news_API_KEY;
    let nData = "";
    https.get(`https://newsapi.org/v2/top-headlines?category=general&country=in&apiKey=${apiKey}&pageSize=100`, function (response) {
        response.on("data", (chunk) => {
            nData += chunk;
        })
        response.on("end", async () => {
            const newsData = await JSON.parse(nData);
            res.render('news', {
                articles: newsData.articles,
                nav: 'News',
                category: 'general'
            });
        })
    }).on('error', (e) => {
        res.render('404page')
    })
})

app.post("/news", (req, res) => {
    const category = req.body.newsCategory;
    const apiKey = process.env.news_API_KEY;
    let nData = "";
    https.get(`https://newsapi.org/v2/top-headlines?category=${category}&country=in&apiKey=${apiKey}&pageSize=100`, function (response) {
        response.on("data", (chunk) => {
            nData += chunk;
        })
        response.on("end", async () => {
            const newsData = await JSON.parse(nData);
            res.render('news', {
                articles: newsData.articles,
                category: req.body.newsCategory,
                nav: 'News'
            });
        })
    }).on('error', (e) => {
        res.render('404page');
    })


})

app.get('*', (req, res) => {
    res.render('404page');
})

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})