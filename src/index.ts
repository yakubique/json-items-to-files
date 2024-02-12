import * as core from '@actions/core';
import { ActionInputs, getInputs, Types } from './io-helper';
import path from "node:path";
import fs from "node:fs";
import get from 'lodash.get';

enum Outputs {
    result = 'result',
}

function setOutputs(response: any, log?: boolean) {
    let message = '';
    for (const key in Outputs) {
        const field: string = (Outputs as any)[key];
        if (log) {
            message += `\n  ${field}: ${JSON.stringify(response[field])}`;
        }
        core.setOutput(field, response[field]);
    }

    if (log) {
        core.info('Outputs:' + message);
    }
}

(async function run() {
    try {
        const inputs: ActionInputs = getInputs();
        const input = JSON.parse(inputs.input) as any[]

        const makePath = (filename: string) => {
            const suffix = `${filename}.${inputs.extension}`;

            return inputs.prefix ? path.join(inputs.prefix, suffix) : suffix;
        }

        const result = [];

        for (let i = 0; i < input.length; i++) {
            const item = input[i];
            let filename = '';

            if (inputs.type === Types.NestedJSON.toString()) {
                filename = makePath(get(item, inputs.key))
            } else {
                filename = makePath(`${i}`)
            }

            fs.writeFileSync(filename, JSON.stringify(item), { encoding: 'utf8' })
            result.push(filename)
        }

        setOutputs({
            result
        })

        core.info('Success!');
    } catch (err: any) {
        core.setFailed(err.message);
    }
})();
