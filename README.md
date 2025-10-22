# Tower-Defense

A browser-based tower defense game built using HTML, JavaScript and CSS.

Defend your base against waves of enemies by strategically placing towers, upgrading your defences and mastering the map layout.

## 🎮 Game Overview

In this game you will:

- Choose and place towers along preset paths to intercept enemy waves.
- Earn resources by defeating enemies, then use those to purchase or upgrade towers.
- Survive increasing waves of enemies with escalating difficulty until the base is breached.

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- Internet access (for any external libraries, though the game may run offline if all assets are local)
- (Optional) Local web server for best performance (to avoid CORS issues)

### Installation & Running

1. Clone or download the repository:
    
    ```bash
    git clone <https://github.com/Moniruzzaman-Shawon/Tower-Defense.git>
    cd Tower-Defense
    
    ```
    

Open index.html in your web browser.

Alternatively, run a local server from the directory, for example:


# using Python 3
```
python3 -m http.server 8000
```
Then navigate to [http://localhost:8000/index.html](http://localhost:8000/index.html).

The game will load — start playing right away.

🕹️ How to Play
On the game page you’ll see the map and available tower buttons.

Click a tower type to select it, then click a valid tile on the map to place it.

Each tower costs resources — watch your resource counter.

Enemies spawn in waves from the entrance and attempt to reach your base.

If enough enemies reach the base, you lose.

Defeated enemies grant you resources; use them to upgrade towers or place new ones.

As waves progress:

Enemy health and speed increase.

New enemy types may appear.

You’ll need to adapt your tower placements and upgrade path.

The game ends when your base is breached or you complete all waves (if specified).

Basic Controls
🎯 Select Tower: Click a tower icon in the sidebar.

🏗 Place Tower: After selecting, click on a valid map tile.

🔼 Upgrade Tower: Click on a placed tower, then click its upgrade button (if available).

🔁 Start Next Wave: Click the “Start Wave” button (if waves are controlled).

🔄 Restart Game: At game over screen, click “Play Again” to reset.

✅ Key Features
Multiple tower types, each with unique attack mechanics and upgrade paths.

Progressive waves of enemies, increasing in difficulty.

Visual map layout with clearly defined paths and placement zones.

Resource management and strategic depth: when and where to build/upgrade matters.

Responsive UI works across desktop and modern browsers.

🧩 Structure
bash
Copy code
/Tower-Defense
|–– index.html       ← Main entry point

|–– game.js          ← Game logic

|–– game-utils.js    ← Utility/helper functions

|–– tests/           ← Automated or manual test files (if any)

|–– specs/           ← Specification or documentation files

|–– .vscode/         ← Editor/workspace settings

|–– .github/         ← GitHub workflows (CI/CD)

📦 Deployment & Hosting
To host the game publicly, simply upload the repository’s contents to any static-hosting provider (GitHub Pages, Netlify, Vercel, etc.).

Example (GitHub Pages):

In your repo settings enable GitHub Pages for the main branch.

Wait for the published link and share it with players.

📝 Contributing
Contributions are welcome! To propose changes:

Fork the repository and create a new branch for your feature or bug fix.

Make your changes, ensure the game still runs smoothly, and update tests or documentation if applicable.

Submit a Pull Request describing your changes.

I will review and merge when ready.

📄 License
Specify your project’s license here (e.g. MIT) and link to a LICENSE file if included.

scss
Copy code
MIT License (c) [Year] [Your Name or Organization]
👤 Author
Moniruzzaman Shawon — GitHub profile
Feel free to reach out for questions or suggestions.

Thank you for playing and contributing!
