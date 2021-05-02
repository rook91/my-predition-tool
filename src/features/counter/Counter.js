import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCount,
} from './counterSlice';
import styles from './Counter.module.css';
import sportsmonksPolandFixtures from '../../data/sportmonks/scottish2020-2021Fixtures.json'

const getFixtureDate = fixture => new Date(fixture.time.starting_at.date_time);
const getFixture = (id) => sportsmonksPolandFixtures.data.find(fixture => fixture.id === id);
const getTeamMatches = (id) => sportsmonksPolandFixtures.data.filter(fixture => (fixture.localteam_id === id || fixture.visitorteam_id === id))
const compareFixturesDate = (firstFixture, secondFixture) => (getFixtureDate(firstFixture) < getFixtureDate(secondFixture)) ? 1 : -1;
const isOver = scores => scores.localteam_score + scores.visitorteam_score > 2.5;

export function Counter() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  const incrementValue = Number(incrementAmount) || 0;

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
            const homeTeamMatches = getTeamMatches(homeTeam);
            const homeTeamMatchesSorted = homeTeamMatches.sort(compareFixturesDate);
            const homeTeamMatchesFiltered = homeTeamMatchesSorted.filter(match => getFixtureDate(match) < matchDate).slice(0, 10);
            const awayTeamMatches = getTeamMatches(awayTeam);
            const awayTeamMatchesSorted = awayTeamMatches.sort(compareFixturesDate);
            const awayTeamMatchesFiltered = awayTeamMatchesSorted.filter(match => getFixtureDate(match) < matchDate).slice(0, 10);

            homeTeamMatchesFiltered.forEach(i => {
              isOver(i.scores) ? stats.home.over++ : stats.home.under++
              console.log(`${i.id} ${i.scores.localteam_score}:${i.scores.visitorteam_score} is over ****${isOver(i.scores)}****`);
            });
            awayTeamMatchesFiltered.forEach(i => isOver(i.scores) ? stats.away.over++ : stats.away.under++);
            console.log(stats);
          }}
        >
          Check Fixture
        </button>
      </div>
    </div>
  );
}
