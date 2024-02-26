import * as core from '@actions/core';
import { ActionInputs, getInputs, Types } from './io-helper';
import path from "node:path";
import fs from "node:fs";
import get from 'lodash.get';
import { buildOutput, inputJson } from "@yakubique/atils/dist";

enum Outputs {
    result = 'result',
}

const setOutputs = buildOutput(Outputs);

(async function run() {
    try {
        const inputs: ActionInputs = getInputs();
        const input = inputJson(inputs.input, inputs.fromFile);

        const makePath = (filename: string) => {
            const suffix = `${filename}.${inputs.extension}`;

            return inputs.prefix ? path.join(inputs.prefix, suffix) : suffix;
        }

        const result = [] as string[];

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
