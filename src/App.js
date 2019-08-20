import React from 'react';
import './App.css';
// import compass from './components/main.js';
import cities from './cities.js';

function getDistanceBetweenCities(cityA, cityB, units) {
    // this is the Haversine formula for determening distance between coordinates on a sphere
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
    if (units === 'imperial')
        distance *= 0.621371;
    return distance;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// returns two different random cities
function getTwoCities() {
    const a = getRandomNumber(0, cities.length);
    let b = getRandomNumber(0, cities.length);
    while (b === a) {
        b = getRandomNumber(0, cities.length);
    }
    return [cities[a].name, cities[b].name];
  }

function calculateScore(inputAnswer, correctAnswer) {
  // debugging here
  alert('inputAnswer = ' + inputAnswer + ', correctAnswer = ' + correctAnswer);
  if (inputAnswer < correctAnswer) {
    return (inputAnswer/correctAnswer)*1000;
  } else {
   return (correctAnswer/inputAnswer)*1000; 
  }
}

class App extends React.Component {

  state = {
    units: 'metric',
    value: '',
    cities: null,
    lastCities: 'Get Two Cities here!',
    lastCity: null,
    penultimateCity: null,
    correctAnswer: null,
    inputAnswer: null,
  };

  handleUnitsButton = () => {
    this.setState(state => ({ units: state.units === 'metric' ? 'imperial' : 'metric' }));
  };

  handleGetCitiesButton = () => {
    let lastCities = getTwoCities();
    this.setState({ lastCity: lastCities[0], penultimateCity:  lastCities[1] })
  };

  handleChange = (event) => {
    this.setState({ value: event.target.value });
    this.setState(state => ({ inputAnswer: state.value }));
  };

  handleSubmit = (event) => {
    // try {
      this.setState(({ lastCity, penultimateCity, units }) => ({
        correctAnswer: getDistanceBetweenCities(
          lastCity,
          penultimateCity,
          units),
      value: alert(this.state.correctAnswer)
      }).then(
      {
        event.preventDefault();
        calculateScore(this.state.inputAnswer, this.state.correctAnswer);
      })
      );
    // } catch(error) {
    //   if (this.state.lastCity === null)
    //     alert('There are no cities to guess the distance between!');
    //   else if (this.state.inputAnswer <= 0)
    //     alert('Distance must be greater than zero!');
    // }
  };

  simulateFetch(callback) {
    window.setTimeout(() => callback(cities), 1000);
  };

  componentDidMount() {
    this.simulateFetch(cities => {
      this.setState({ cities });
    });
  }

  render() {
    const { cities } = this.state;
    if (!cities) {
      return (
        <p>Loading...</p>
      );
    }
    return (
      <div className="App-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
            </tr>
          </thead>
          <tbody>
            {
              cities.map((city, index) => (
                <tr key={index}>
                  <td>{city.name}</td>
                  <td>{city.latitude}</td>
                  <td>{city.longitude}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <button onClick={ this.handleGetCitiesButton }>
          {this.state.lastCities}
        </button>
        <button onClick={ this.handleUnitsButton }>
          {this.state.units}
        </button>
        <p>{this.state.lastCity}</p>
        <p>{this.state.penultimateCity}</p>
        <p>What is their distance?</p>
        <form onSubmit={this.handleSubmit}>
          <label>
            Your guess:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <p>{}</p>
      </div>
    );
  }
}

export default App;