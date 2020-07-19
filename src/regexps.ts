import { readFileSync } from 'fs';
import { resolve } from 'path';

interface Regexp {
    regexp: string,
    type: 'picture' | 'sticker',
    filename: string
}

const jsonString = readFileSync(resolve(__dirname, '../assets/regexps.json'), { encoding: 'utf8' });
const regexps: Array<Regexp> = JSON.parse(jsonString) as Array<Regexp>;

export {
    regexps
};
