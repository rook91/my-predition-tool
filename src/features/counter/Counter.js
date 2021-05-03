import React, { useState } from 'react';
import styles from './Counter.module.css';
import sportsmonksPolandFixtures from '../../data/sportmonks/scottish2020-2021Fixtures.json'
import bets16475472 from '../../data/sportmonks/16475472.json'

const getFixtureDate = fixture => new Date(fixture.time.starting_at.date_time);
const getFixture = (id) => sportsmonksPolandFixtures.data.find(fixture => fixture.id === id);
const getLastTeamMatches = (id) => sportsmonksPolandFixtures.data.filter(fixture => (fixture.localteam_id === id || fixture.visitorteam_id === id))
const getH2HMatches = (team1ID, team2ID) => sportsmonksPolandFixtures.data.filter(
  fixture => {
    const {localteam_id, visitorteam_id} = {...fixture};
    return (localteam_id === team1ID && visitorteam_id === team2ID) || (localteam_id === team2ID && visitorteam_id === team1ID)
  });
const compareFixturesDate = (firstFixture, secondFixture) => (getFixtureDate(firstFixture) < getFixtureDate(secondFixture)) ? 1 : -1;
const isOver = scores => scores.localteam_score + scores.visitorteam_score > 2.5;

export function Counter() {

  const [incrementAmount, setIncrementAmount] = useState('2');

  return (
    <div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(Number(e.target.value))}
        />
        <button
          className={styles.button}
          onClick={() => {
            const stats = {
              h2hlast6: {
                over: 0,
                under: 0
              },
              h2hlast3Home: {
                over: 0,
                under: 0
              },
              home: {
                over: 0,
                under: 0
              },
              away: {
                over: 0,
                under: 0
              }
            };
            const fixture = getFixture(incrementAmount);
            const homeTeam = fixture.localteam_id;
            const awayTeam = fixture.visitorteam_id;
            const matchDate = getFixtureDate(fixture);

            // Last 10 matches
            const homeTeamMatches = getLastTeamMatches(homeTeam);
            const homeTeamMatchesSorted = homeTeamMatches.sort(compareFixturesDate);
            const homeTeamMatchesFiltered = homeTeamMatchesSorted.filter(match => getFixtureDate(match) < matchDate).slice(0, 10);
            const awayTeamMatches = getLastTeamMatches(awayTeam);
            const awayTeamMatchesSorted = awayTeamMatches.sort(compareFixturesDate);
            const awayTeamMatchesFiltered = awayTeamMatchesSorted.filter(match => getFixtureDate(match) < matchDate).slice(0, 10);

            homeTeamMatchesFiltered.forEach(i => isOver(i.scores) ? stats.home.over++ : stats.home.under++);
            awayTeamMatchesFiltered.forEach(i => isOver(i.scores) ? stats.away.over++ : stats.away.under++);

            // H2H matches
            const h2hMatches = getH2HMatches(homeTeam, awayTeam);
            const h2hMatchesSorted = h2hMatches.sort(compareFixturesDate);
            const h2hMatchesFiltered = h2hMatchesSorted.filter(match => getFixtureDate(match) < matchDate)
            const last6h2hMatches = h2hMatchesFiltered.slice(0, 6);
            const h2hHomeMatchesFiltered = h2hMatchesFiltered.filter(fixture => fixture.localteam_id === homeTeam)

            last6h2hMatches.forEach(i => isOver(i.scores) ? stats.h2hlast6.over++ : stats.h2hlast6.under++);
            h2hHomeMatchesFiltered.forEach(i => isOver(i.scores) ? stats.h2hlast3Home.over++ : stats.h2hlast3Home.under++);

            console.log(stats);

            // Algorithm
            const oH2Hlast6 = stats.h2hlast6.over;
            const uH2Hlast6 = stats.h2hlast6.under;
            const sH2Hlast6 = oH2Hlast6 + uH2Hlast6;

            const oH2Hlast3Home = stats.h2hlast3Home.over;
            const uH2Hlast3Home = stats.h2hlast3Home.under;
            const sH2Hlast3Home = oH2Hlast3Home + uH2Hlast3Home;
            
            const oHome = stats.home.over;
            const uHome = stats.home.under;
            const sHome = oHome + uHome;

            const oAway = stats.away.over;
            const uAway = stats.away.under;
            const sAway = oAway + uAway;

            const overP = Math.round((oH2Hlast6/sH2Hlast6 + oH2Hlast3Home/sH2Hlast3Home + oHome/sHome + oAway/sAway)/4*1000)/10;
            const underP = 100 - overP;
            console.log(overP);
            console.log(underP);

            // Get odds 
          }}
        >
          Check Fixture
        </button>
      </div>
    </div>
  );
}
