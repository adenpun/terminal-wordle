import * as readline from "node:readline";
import * as fs from "node:fs";
const cli = require("cli-color");
import "cli-color";
import path from "node:path";

var wordList: string;
var correctWord: string;
var times: number = 1;
var history: string[][] = [];
var isWon: boolean = false;

(async () => {
    wordList = await fs
        .readFileSync(path.join(__dirname, "../", "word-list.txt"))
        .toString();
    var splitedWordList = wordList.split(/\r?\n/);
    console.clear();
    correctWord =
        splitedWordList[Math.floor(Math.random() * splitedWordList.length)];
    console.log(cli.yellow(`${correctWord.length} letter word.`));
    while (true) {
        const answer = await questionPromise(`> `);
        if (answer.length != correctWord.length) {
            console.log(cli.red("WRONG LENGTH"));
            continue;
        }
        display(answer);
        if (isWon) break;
        times++;
        if (times > 6) {
            break;
        }
    }
    console.log();
    console.log();
    console.log(`Correct Word: ${correctWord}`);
    history.forEach((element, i) => {
        var output: string = "";
        element.forEach((element) => {
            output += element;
        });
        console.log(`${cli.yellow(i + 1)} ${output}`);
    });
})();

function questionPromise(query: string): Promise<string> {
    return new Promise<string>((resolve) => {
        const rl = readline.createInterface(process.stdin, process.stdout);
        rl.question(query, (answer: string) => {
            resolve(answer);
            rl.close();
        });
    });
}

function display(word: string): void {
    var output: string = "";
    var repeatMap: Map<string, number[]> = new Map<string, number[]>();
    for (let i = 0; i < word.length; i++) {
        const letter: string = word[i];
        const correctLetter: string = correctWord[i];
        const outputLetter: string = ` ${letter} `;
        var styledLetter;
        if (letter == correctLetter) {
            styledLetter = cli.bgGreen(outputLetter);
        } else if (isContainLetter(letter).boolean) {
            repeatMap.set(letter, isContainLetter(letter).position!);
            if (repeatMap.get(letter)![i])
                styledLetter = cli.bgYellow(outputLetter);
            else styledLetter = outputLetter;
        } else {
            styledLetter = outputLetter;
        }
        output += styledLetter;
        if (history[times - 1] == undefined) history[times - 1] = [];
        history[times - 1][i] = styledLetter;
    }
    output += ` ${cli.yellow(`${times}/6`)}`;
    console.log(output);
    if (word == correctWord) isWon = true;
}

function isContainLetter(letter: string): {
    boolean: boolean;
    times?: number;
    position?: number[];
} {
    if (correctWord.indexOf(letter) < 0) {
        return { boolean: false };
    }
    var times: number = 0;
    var position: number[] = [];
    let i: number = 0;
    while (true) {
        if (correctWord[i] == letter) {
            times++;
            position.push(i);
        }
        i++;
        if (i >= correctWord.length) break;
    }
    if (times > 0) return { boolean: true, times, position };
    return { boolean: false };
}
