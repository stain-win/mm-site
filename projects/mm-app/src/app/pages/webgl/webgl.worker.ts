// import {createLines, createLinesGeometry} from '../../utils/createLines';
/// <reference lib="webworker" /
addEventListener('message', (data) => {
    console.log(data);
    const response = "data.create(data.lines);"
    postMessage(response);
});

