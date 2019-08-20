const fs = require('fs');
const util = require('util');
// const writeFile = util.promisify(fs.writeFile);

async function foo() {
    await localStorage.setItem('cities_file', JSON.stringify(await readCitiesFile()));
    // let oop = await localStorage.getItem('cities_file');
    let oop = await localStorage.getItem('cities_file');
    alert(JSON.stringify(oop));
}

async function readCitiesFile() {
    return await fetch('cities.json').then(response => {
        console.log(response);
        return response.json();
    }).then(json => {
        console.log(json)
        return json;
    })
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

// returns two different random cities, with their coordinates
async function getTwoCities(mapFile) {
    const json = JSON.parse(await readCitiesFile());
    const a = getRandomNumber(0, json.length);
    let b = getRandomNumber(0, json.length);
    while (b === a) {
        b = getRandomNumber(0, json.length);
    }
    return [json[a], json[b]];
}

// returns the coordinates of a city, and if they're not in the 'cities.json' file,
// then they are added to it as a new entry.
async function coordinatesOfCity(cityName) {
    return await readCitiesFile()
        .then(results => {
            let cities = JSON.parse(results);
            // console.log(cities);
            // cities = JSON.stringify(cities);
            const c = getCityLocation(cityName);
            // readCitiesFile().then(results => {
            //     console.log(JSON.parse(results));
            // });
            return c;
        }
    );
}

// coordinatesOfCity('York').then(results => console.log(results));

const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAswlJyg33p9zcYo9ICHLxaeEdQtcNWShs',
  Promise
})

function fetchCityLocation(address) {
    return googleMapsClient.geocode({ address }).asPromise().then(response => {
        const { lat, lng: lon } = response.json.results[0].geometry.location;
        return [lat, lon];
  })
}

async function getCityLocation(cityName) {
    const c = await lookupCityInFile(cityName);
    if (c !== null) {
        return c;
    } else {
        await addCityToFile('cities.json', cityName);
        const w = await lookupCityInFile(cityName);
        return w;
    }
}

async function addCityToFile(mapFile, cityName) {
    const coordinates = await fetchCityLocation(cityName);
    readCitiesFile().then( results => 
        {
            let json = JSON.parse(results);
            json.push({name: cityName, latitude: coordinates[0], longitude: coordinates[1]});
            // writeFile(mapFile, JSON.stringify(json));
        }
    );
}

async function getCoordinates(cityName) {
    const c = await getCityLocation(cityName);
    console.log(c);
}

async function lookupCityInFile(name) {
    const json = JSON.parse(await readCitiesFile());
    for (let index = 0; index < json.length; ++index) {
        if (json[index].name === name) {
            // console.log('city found!');
            return [json[index].latitude, json[index].longitude];
        }
    }
    return null;    
}

async function getDistanceBetweenCities(cityA, cityB, isImperial) {
    // this is the Haversine formula for determening distance between coordinates on a sphere
    const cities = await JSON.parse(await readCitiesFile());
    const pointA = cities.find(city => city.name === cityA);
    const pointB = cities.find(city => city.name === cityB);
    const radius = 6371; //in km
    const phi1 = pointA.latitude*(Math.PI / 180),  lambda1 = pointA.longitude*(Math.PI / 180);
    const phi2 = pointB.latitude*(Math.PI / 180), lambda2 = pointB.longitude*(Math.PI / 180);
    const deltaPhi = phi2 - phi1;
    const deltaLambda = lambda2 - lambda1;
    const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2)
              + Math.cos(phi1) * Math.cos(phi2)
              * Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var distance = radius * c;
    if (isImperial)
        distance *= 0.621371;
    return distance;
}

// getDistanceBetweenCities('New York', 'Stockholm', false).then(result => console.log(result));