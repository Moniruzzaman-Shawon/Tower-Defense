const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');

// Load game-utils.js and execute in sandbox
const filePath = path.resolve(__dirname, '../game-utils.js');
let src = fs.readFileSync(filePath, 'utf8');
src = src.replace(/^```[a-zA-Z]*\n/, '');
src = src.replace(/\n```\s*$/, '');

class MockStorage { constructor(){ this.map={}; } getItem(k){ return Object.prototype.hasOwnProperty.call(this.map,k)? this.map[k]: null; } setItem(k,v){ this.map[k]=String(v); } removeItem(k){ delete this.map[k]; } }

const sandbox = { console: console, localStorage: new MockStorage(), window: {}, Date: Date };
vm.createContext(sandbox);
vm.runInContext(src, sandbox);

const loadLeaderboard = sandbox.loadLeaderboard;
const saveLeaderboard = sandbox.saveLeaderboard;
const updateLeaderboardEntry = sandbox.updateLeaderboardEntry;
const setPlayerName = sandbox.setPlayerName;
const getPlayerName = sandbox.getPlayerName;

// Test tie-breaker ordering by newer ISO
saveLeaderboard([
  {name:'Old', score: 50, iso: '2020-01-01T00:00:00Z'},
  {name:'New', score: 50, iso: '2025-01-01T00:00:00Z'}
]);
let arr = loadLeaderboard();
assert.strictEqual(arr[0].name, 'New', 'Newer iso should come first for tie');

// Test set/get player name
setPlayerName('Tester');
assert.strictEqual(getPlayerName(), 'Tester', 'Player name should be stored and retrievable');

console.log('leaderboard_tiebreak tests passed');
