// const TelegramBot = require('node-telegram-bot-api')
import './env';
import TelegramBot from 'node-telegram-bot-api';
import path from 'path';
import request from 'request';
import fs from 'fs';

import { regexps } from './regexps';

interface Currency {
    rates: {
        EUR: number,
        RUB: number,
        USD: number
    },
    base: string,
    date: string
}

function addListenersForBot(bot: TelegramBot): void {
    bot.onText(/\/start/, (msg) => {
        void bot.sendMessage(msg.chat.id, 'Привет, я тупой бот. Добавь меня в бесду, чтобы было веселее!');
    });

    for (const regexp of regexps) {
        bot.onText(new RegExp(regexp.regexp), (msg) => {
            if (regexp.type == 'picture') {
                sendPicture(bot, msg.chat.id, regexp.filename);
            }
            else {
                sendSticker(bot, msg.chat.id, regexp.filename);
            }
        });
    }
    bot.onText(/[кК]оторый ча[сз]/, (msg) => {
        void bot.sendMessage(msg.chat.id, timeToString(new Date(Date.now())));
    });
    bot.onText(/([сС]кольк[оа] стоит )(дол[л]?ар|евро)/, async(msg, match) => {
        let promise: Promise<Currency>|null = null;
        if (match) {
            switch (match[2]) {
                case 'долар':
                case 'доллар':
                    promise = getCurrency('USD');
                    break;
                case 'евро':
                    promise = getCurrency('EUR');
                    break;
            }
        }
        if (promise) {
            const result: Currency = await promise;
            await bot.sendMessage(msg.chat.id, `${result.rates.RUB.toFixed(2)} рубля`);
        }
    });
}

function sendPicture(bot: TelegramBot, chatId: number, photoName: string) {
    const stream = fs.createReadStream(path.resolve(__dirname, '../assets/' + photoName));
    console.log('Sending photo', photoName);
    stream.on('open', () => {
        void bot.sendPhoto(chatId, stream);
    });
}

function sendSticker(bot: TelegramBot, chatId:number, stickerName: string) {
    const stream = fs.createReadStream(path.resolve(__dirname, '../assets/' + stickerName));
    console.log('Sending sticker', stickerName);
    stream.on('open', () => {
        void bot.sendSticker(chatId, stream);
    });
    stream.on('error', (err) => {
        console.log('[ERROR] ', err);
    });
}

async function getCurrency(cur: string): Promise<Currency> {
    return new Promise((resolve) => {
        request('https://api.exchangeratesapi.io/latest?base=' + cur, {
            json: true
        }, (error, response, body) => {
            if (error) {
                throw error;
            }
            resolve(body as Currency);
        });
    });
}

function timeToString(date: Date) {
    return `0${date.getHours()}`.slice(-2) + ':' + `0${date.getMinutes()}`.slice(-2) + ':' + `0${date.getSeconds()}`.slice(-2);
}

if (process.env.TOKEN) {
    const bot = new TelegramBot(process.env.TOKEN, { polling: true });
    void addListenersForBot(bot);
}
