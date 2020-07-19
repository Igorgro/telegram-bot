# Telegram bot
Demo Telegram bot which sends stickers and does some useful tricks.
## Build and run
Create `.env` file with the following content:
```
TOKEN=<your-bot-token>
```
Then run
```bash
npm install
npm run build
npm start
```
### How to use memes
This bot can trigger on regexps and send coreesponding pictures and stickers.
Place memes pictures into `assets` folder and create there a file named `regexps.json` with the following content:
```json
[
    {
        "regexp": "Regexp to trigger",
        "type": "picture or sticker",
        "filename": "file name inside 'assets' folder"
    }
]
```
