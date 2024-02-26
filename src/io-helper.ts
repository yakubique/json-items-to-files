import * as core from '@actions/core';
import { getBooleanInput, getOptional } from "@yakubique/atils/dist";

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

    result.type = getOptional(Inputs.Type, Types.FlatJSON, { required: false })

    if (result.type == Types.NestedJSON) {
        result.key = core.getInput(Inputs.Key, { required: true })
    }

    result.extension = getOptional(Inputs.Extension, 'json', { required: false })

    result.prefix = `${core.getInput(Inputs.Prefix, { required: false })}`
    result.fromFile = getBooleanInput(Inputs.FromFile, { required: false })

    return result;
}
