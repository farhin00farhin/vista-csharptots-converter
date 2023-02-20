import { ParseResult } from "./parse";

export interface CSharpEnumProperty {
    name: string;
}

export function parseEnum(code: string): ParseResult<CSharpEnumProperty> | null {
    const regex = /^(?!\s*\/\/\/)\s*(\w+)/gm; // the "gm" flags indicate global and multiline matching
    const match =regex.exec(code);
    const invalidPropName =  ['internal', 'public', 'private', 'protected'].find(i=> i === match?.[1])

    if (invalidPropName || !match) {
        return null;
    } else {
        return {
            index: match.index,
            length: match[0].length,
            data: {   
                name: match[0],
            }
        }
    }
}