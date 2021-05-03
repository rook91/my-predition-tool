import React from 'react';
import { Counter } from './features/counter/Counter';
import './App.css';
import sportsmonksPolandFixtures from './data/sportmonks/scottish2020-2021Fixtures.json'
import { fetchFixturesDateRange } from './AppFunctions'

const getRow = (index) => {
  return(
    <div key={sportsmonksPolandFixtures.data[index].id}>
      <span>ID: {sportsmonksPolandFixtures.data[index].id}</span>
      <span> Home Team ID: {sportsmonksPolandFixtures.data[index].localteam_id}</span>
      <span> Away Team ID: {sportsmonksPolandFixtures.data[index].visitorteam_id}</span>
    </div>
  )
}

function App() {
  // fetchFixturesDateRange();
  return (
    <div className="App">
      {sportsmonksPolandFixtures.data.map((item, index) => getRow(index))}
      <Counter />
    </div>
  );
}

export default App;
