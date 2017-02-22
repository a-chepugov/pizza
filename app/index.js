"use strict";

const fs = require('fs');
const path = require('path');
const config = require('config');

const Pizza = require('./models/Pizza');
const State = require('./models/State');

async function saveData(output, fileName, data, size) {
    let pathString = `${output}/${fileName}`;
    let is = fs.existsSync(pathString);
    if (!is) {
        let is = fs.existsSync(output);
        if (!is) {
            fs.mkdirSync(output);
        }
        fs.mkdirSync(pathString);
    }

    let path = `${pathString}/${fileName}.out`;

    let suffix = (new Date()).toISOString();
    let pathTemp = `${path}.${size}.${suffix}`;

    try {
        fs.writeFileSync(pathTemp, data);
        fs.writeFileSync(path, data);
        console.info(`${pathTemp} saved`);
    } catch (err) {
        err.message += 'File saving error\n';
        throw err
    }
}

async function index() {
    console.time('all');

    let output = config.output;
    let file = config.file;
    let fileName = path.basename(file, '.in');

    let pizza = await Pizza.createInstance(file);

    let state = State.createInstanse(pizza);

    for (let set of state.getAnotherSet()) {
        console.log('index.js(index) =>', set.area, set.areaCutted, set.areaSkipped, set.areaFree);
        let setDump = set.forSave();
        saveData(output, fileName, setDump, set.area);
    }

    console.timeEnd('all');
}

module.exports = index;