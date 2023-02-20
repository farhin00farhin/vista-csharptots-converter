"use strict";

import { parseProperty } from "./properties";
import { parseMethod, parseConstructor, parseRecord } from "./methods";
import * as path from "path";
import * as fs from "fs";

import {
    generateProperty,
    trimMemberName,
    generateMethod,
    generateConstructor,
    generateClass,
    generateRecord,
    generateEnum,
} from "./generators";
import { ParseResult } from "./parse";
import { parseClass } from "./classes";
import { generateJsDoc, parseXmlDocBlock } from "./comment-doc";
import { parseEnum } from "./enum";

function csFunction<T>(parse: (code: string) => ParseResult<T> | null, generate: (value: T) => string) {
    return function (code: string) {
        const parseResult = parse(code);
        if (!parseResult) {
            return null;
        } else {
            return {
                result: generate(parseResult.data),
                index: parseResult.index,
                length: parseResult.length
            } as MatchResult;
        }
    }
}

/**Convert a c# automatic or fat arrow property to a typescript property. Returns null if the string didn't match */
const csAutoProperty = csFunction(parseProperty, generateProperty);
/**Convert a C# method to a typescript method signature */
const csRecord = csFunction(parseRecord, generateRecord);
const csMethod = csFunction(parseMethod, generateMethod);
const csConstructor = csFunction(parseConstructor, generateConstructor);
const csCommentSummary = csFunction(parseXmlDocBlock, generateJsDoc);
const csClass = csFunction(parseClass, generateClass);
const csEnum = csFunction(parseEnum, generateEnum);

function csAttribute(code: string): MatchResult {
    var patt = /[ \t]*\[\S*\][ \t]*\r?\n/;
    var arr = patt.exec(code);
    if (arr == null) return null;

    return {
        result: "",
        index: arr.index,
        length: arr[0].length,
    };
}

interface Match {
    /**Replacement string */
    result: string;
    /**Original index */
    index: number;
    /**Original lenght */
    length: number;
}

type MatchResult = Match | null;

function csPublicMember(code: string): MatchResult {
    var patt = /public\s*(?:(?:abstract)|(?:sealed))?(\S*)\s+(.*)\s*{/;
    var arr = patt.exec(code);

    var tsMembers: { [index: string]: string } = {
        class: "interface",
        struct: "interface",
    };

    if (arr == null) return null;
    var tsMember = tsMembers[arr[1]];
    var name = trimMemberName(arr[2]);
    return {
        result: `export ${tsMember || arr[1]} ${name} {`,
        index: arr.index,
        length: arr[0].length,
    };
}



/**Find the next match */
function findMatch(
    code: string,
    startIndex: number,
): MatchResult {
    code = code.substr(startIndex);

    var functions: ((code: string) => MatchResult)[] = [
        csRecord,
        csClass,
        csAutoProperty,
        csConstructor,
        csMethod,
        csCommentSummary,
        csAttribute,
        csPublicMember,
        csEnum
    ];

    var firstMatch: MatchResult = null;
    for (let i = 0; i < functions.length; i++) {
        var match = functions[i](code);
        if (match != null && (firstMatch == null || match.index < firstMatch.index)) {
            firstMatch = match;
        }
    }

    return firstMatch ? {
        result: firstMatch.result,
        index: firstMatch.index + startIndex,
        length: firstMatch.length
    } : null;
}

function removeSpecialKeywords(code: string): string {
    return code
        .replace(/\s+virtual\s+/g, " ")
        .replace(/#nullable\s*(disable|enable)\s*\n/g, "");
}

function removeUsings(code: string): string {
    return code.replace(/using\s+[^;]+;\s*\n/g, "")
}

function removeNamespace(code: string): string {
    return code.replace(/namespace\s+[^;]+;\s*\n/g, '');
}


/**Convert c# code to typescript code */
export function cs2ts(code: string): string {
    var ret = "";

    code = removeSpecialKeywords(code);
    code = removeUsings(code);
    code = removeNamespace(code);


    var index = 0;
    while (true) {
        var nextMatch = findMatch(code, index);
        if (nextMatch == null) break;
        //add the last unmatched code:
        ret += code.substr(index, nextMatch.index - index);

        //add the matched code:
        ret += nextMatch.result;

        //increment the search index:
        index = nextMatch.index + nextMatch.length;
    }
    //add the last unmatched code:
    ret += code.substr(index);
    const ccc = /^(?:[\t ]*(?:\r?\n|\r)){2,}/gm
    return ret.replace(ccc, '\n\n');
}

function camelToDash(text: string) {
    return text.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function convert(directoryPath = path.join(process.argv[2])) {
    fs.readdir(directoryPath, function (err, items) {
        if (err) return console.log("❌ Unable to scan directory: " + err);

        items.forEach((item) => {
            const itemPath = path.join(directoryPath, item);
            let newItemPath;

            // Directory
            if (fs.existsSync(itemPath) && fs.lstatSync(itemPath).isDirectory()) {
                const newDirectoryPath = path.join(directoryPath, `${camelToDash(item)}`);
                if (fs.existsSync(newDirectoryPath)) {
                    console.log("ℹ️  Skipping renaming. Directory already exists.", newDirectoryPath);
                }
                else {
                    fs.renameSync(itemPath, newDirectoryPath);
                    newItemPath = newDirectoryPath;
                }

                convert(newItemPath || itemPath)

            }

            const [filePath, fileExtension] = item.split(".");
            if (fileExtension === "cs") {
                var contents = fs.readFileSync(itemPath).toString();
                fs.writeFileSync(itemPath, cs2ts(contents), {
                    flag: 'w',
                });
                fs.renameSync(itemPath, path.join(directoryPath, `${camelToDash(filePath)}.ts`));

            }
        });
    });
}

convert()
