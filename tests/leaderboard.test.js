const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');

// Load game-utils.js text and strip markdown fences if present
const filePath = path.resolve(__dirname, '../game-utils.js');
let src = fs.readFileSync(filePath, 'utf8');
src = src.replace(/^```[a-zA-Z]*\n/, '');
src = src.replace(/\n```\s*$/, '');

// Create a simple in-memory localStorage mock
class MockStorage {
  constructor(){ this.map = {}; }
  getItem(k){ return Object.prototype.hasOwnProperty.call(this.map,k)? this.map[k]: null; }
  setItem(k,v){ this.map[k]=String(v); }
  removeItem(k){ delete this.map[k]; }
}

const sandbox = {
  console: console,
  localStorage: new MockStorage(),
  window: {},
  Date: Date
};
vm.createContext(sandbox);
vm.runInContext(src, sandbox);

const loadLeaderboard = sandbox.loadLeaderboard;
const saveLeaderboard = sandbox.saveLeaderboard;
const updateLeaderboardEntry = sandbox.updateLeaderboardEntry;
const setPlayerName = sandbox.setPlayerName;
const getPlayerName = sandbox.getPlayerName;

// Begin tests
// Clean slate
sandbox.localStorage.removeItem('leaderboard');

updateLeaderboardEntry('Alice', 100);
let arr = loadLeaderboard();
assert.strictEqual(arr.length, 1, 'Should have 1 entry after adding Alice');
assert.strictEqual(arr[0].name, 'Alice');
assert.strictEqual(arr[0].score, 100);

updateLeaderboardEntry('Bob', 200);
arr = loadLeaderboard();
assert.strictEqual(arr[0].name, 'Bob', 'Bob with 200 should be first');

updateLeaderboardEntry('Alice', 150);
arr = loadLeaderboard();
assert.strictEqual(arr[0].name, 'Bob');
assert.strictEqual(arr[1].name, 'Alice');
assert.strictEqual(arr[1].score, 150, 'Alice should be updated to 150');

// Lower score should not replace
updateLeaderboardEntry('Alice', 120);
arr = loadLeaderboard();
const alice = arr.find(r=>r.name==='Alice');
assert.strictEqual(alice.score, 150, 'Alice should remain at 150 when lower score submitted');

// Tie-breaker: newer iso first
saveLeaderboard([
  {name:'Old', score:100, iso:'2020-01-01T00:00:00Z'},
  {name:'New', score:100, iso:'2025-01-01T00:00:00Z'}
]);
arr = loadLeaderboard();
assert.strictEqual(arr[0].name, 'New', 'Newer iso should come first on tie');

console.log('All leaderboard tests passed');
