import * as types from './types';

import { CSharpProperty } from "./properties";
import { CSharpMethod, CSharpParameter, CSharpConstructor, CSharpRecord } from "./methods";
import { CSharpClass } from "./classes";
import { CSharpEnumProperty } from './enum';

function generateType(type: string): string {
    const parseType = types.parseType(type);
    return trimMemberName(parseType ? types.convertToTypescript(parseType) : type);
}

function generateParam(value: CSharpParameter, separator: string): string {
    const tsType = generateType(value.type);
    return value.name + ": " + tsType + value.spaceBeforeComma + separator + value.spaceAfterComma;
}

function generateControllerBody(name: string, params: CSharpParameter[]): string {
    const isUriSimpleType = (x: CSharpParameter) => {
        const parseType = types.parseType(x.type);
        return parseType && types.isUriSimpleType(parseType);
    }

    const simpleParams = params.filter(isUriSimpleType).map(x => x.name).join(", ");
    const bodyParams = params.filter(x => !isUriSimpleType(x)).map(x => x.name).join(", ");

    if (bodyParams.length == 0) {
        return ` => await controller('${name}', {${simpleParams}}), `;
    } else {
        return ` => await controller('${name}', {${simpleParams}}, ${bodyParams}), `;
    }
}

export function generateMethod(value: CSharpMethod): string {
  return ""
}


export function generateConstructor(value: CSharpConstructor): string {
    const paramList = value.parameters.map((x, i) => generateParam(x, i == (value.parameters.length - 1) ? "" : ",")).join("");
    return "";
}

const myClass = {
    myMethod: (hola: boolean): string => {
        throw new Error("TODO: Implement me");
    }
}

export function generateRecord(value: CSharpRecord): string {
    const paramList = value.parameters.map(x => generateParam(x, ";")).join("");

    const signature = generateClass({
        name: value.name,
        inherits: [],
        isPublic: value.isPublic,
        type: "class"
    });

    const full = signature + value.spaceAfterOpenPar + paramList + "}";
    return full;
}


/**Generate a typescript property */
export function generateProperty(prop: CSharpProperty): string {
    //trim spaces:
    const tsType = generateType(prop.type);
    const name = getTypescriptPropertyName(prop.name);
    return `${name}${prop.isRequired ? ": " : "?: "}${tsType};`;
}

/**Generate a typescript enum */
export function generateEnum(prop: CSharpEnumProperty): string {
    return `${prop.name} = '${trimMemberName(prop.name)}'`;
}


export function generateClass(x: CSharpClass): string {
    const inheritsTypes = x.inherits.map(x => generateType(x));
    const name = x.name;
    const modifier = (x.isPublic ? "export " : "");
    const keyword =  "interface";
    const prefix = `${modifier}${keyword} ${name}`;
    if (inheritsTypes.length > 0) {
        return `${prefix} extends ${inheritsTypes.join(", ")} {`;
    } else {
        return `${prefix} {`;
    }
}

function getTypescriptPropertyName(name: string) {
    var isAbbreviation = name.toUpperCase() == name;
    name = trimMemberName(name);
    if (!isAbbreviation) {
        return name[0].toLowerCase() + name.substr(1);
    }

    return name;
}

export function trimMemberName(name: string): string {
    name = name.trim();
    var trimmed = true;
    do {
        trimmed = false;
    } while (trimmed); // trim recursive until no more occurrences will be found

    return name;
}

function trimEnd(text: string, postfix: string) {
    if (text.endsWith(postfix)) {
        return text.substr(0, text.length - postfix.length);
    }
    return text;
}