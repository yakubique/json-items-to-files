import * as core from '@actions/core';
import { InputOptions } from '@actions/core';

enum Inputs {
    Input = 'input',
    Type = 'type',
    Key = 'key',
    Extension = 'extension',
    Prefix = 'prefix',
    FromFile = 'from_file'
}

export enum Types {
    FlatJSON = 'flat-json',
    NestedJSON = 'nested-json'
}

function isBlank(value: any): boolean {
    return value === null || value === undefined || (value.length !== undefined && value.length === 0);
}

export function isNotBlank(value: any): boolean {
    return value !== null && value !== undefined && (value.length === undefined || value.length > 0);
}

export function getBooleanInput(name: string, options?: InputOptions): boolean {
    const value = core.getInput(name, options);

    return isNotBlank(value) &&
        ['y', 'yes', 't', 'true', 'e', 'enable', 'enabled', 'on', 'ok', '1']
            .includes(value.trim().toLowerCase());
}

export interface ActionInputs {
    input: string;
    type: string;
    key: string;
    extension: string;
    prefix: string;
    fromFile: boolean;
}

export function getInputs(): ActionInputs {
    const result: ActionInputs | any = {};

    result.input = `${core.getInput(Inputs.Input, { required: true })}`

    const typeVar = core.getInput(Inputs.Type, { required: false })
    if (isBlank(typeVar)) {
        result.type = Types.FlatJSON
    } else {
        result.type = typeVar
    }

    if (result.type == Types.NestedJSON) {
        result.key = core.getInput(Inputs.Key, { required: true })
    }

    const extension = core.getInput(Inputs.Extension, { required: false })
    if (isBlank(extension)) {
        result.extension = 'json'
    } else {
        result.extension = extension.replace('.', '')
    }

    result.prefix = `${core.getInput(Inputs.Prefix, { required: false })}`
    result.fromFile = getBooleanInput(Inputs.FromFile, { required: false })

    return result;
}
