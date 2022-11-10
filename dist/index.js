"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("node:readline"));
const fs = __importStar(require("node:fs"));
const cli = require("cli-color");
require("cli-color");
const node_path_1 = __importDefault(require("node:path"));
var wordList;
var correctWord;
var times = 1;
var history = [];
var isWon = false;
(() => __awaiter(void 0, void 0, void 0, function* () {
    wordList = yield fs
        .readFileSync(node_path_1.default.join(__dirname, "../", "word-list.txt"))
        .toString();
    var splitedWordList = wordList.split(/\r?\n/);
    console.clear();
    correctWord =
        splitedWordList[Math.floor(Math.random() * splitedWordList.length)];
    console.log(cli.yellow(`${correctWord.length} letter word.`));
    while (true) {
        const answer = yield questionPromise(`> `);
        if (answer.length != correctWord.length) {
            console.log(cli.red("WRONG LENGTH"));
            continue;
        }
        display(answer);
        if (isWon)
            break;
        times++;
        if (times > 6) {
            break;
        }
    }
    console.log();
    console.log();
    console.log(`Correct Word: ${correctWord}`);
    history.forEach((element, i) => {
        var output = "";
        element.forEach((element) => {
            output += element;
        });
        console.log(`${cli.yellow(i + 1)} ${output}`);
    });
}))();
function questionPromise(query) {
    return new Promise((resolve) => {
        const rl = readline.createInterface(process.stdin, process.stdout);
        rl.question(query, (answer) => {
            resolve(answer);
            rl.close();
        });
    });
}
function display(word) {
    var output = "";
    var repeatMap = new Map();
    for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        const correctLetter = correctWord[i];
        const outputLetter = ` ${letter} `;
        var styledLetter;
        if (letter == correctLetter) {
            styledLetter = cli.bgGreen(outputLetter);
        }
        else if (isContainLetter(letter).boolean) {
            repeatMap.set(letter, isContainLetter(letter).position);
            if (repeatMap.get(letter)[i])
                styledLetter = cli.bgYellow(outputLetter);
            else
                styledLetter = outputLetter;
        }
        else {
            styledLetter = outputLetter;
        }
        output += styledLetter;
        if (history[times - 1] == undefined)
            history[times - 1] = [];
        history[times - 1][i] = styledLetter;
    }
    output += ` ${cli.yellow(`${times}/6`)}`;
    console.log(output);
    if (word == correctWord)
        isWon = true;
}
function isContainLetter(letter) {
    if (correctWord.indexOf(letter) < 0) {
        return { boolean: false };
    }
    var times = 0;
    var position = [];
    let i = 0;
    while (true) {
        if (correctWord[i] == letter) {
            times++;
            position.push(i);
        }
        i++;
        if (i >= correctWord.length)
            break;
    }
    if (times > 0)
        return { boolean: true, times, position };
    return { boolean: false };
}
