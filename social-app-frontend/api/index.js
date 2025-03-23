require('dotenv').config();
const express = require('express');
const app = express();

console.log("Testing basic log output");

app.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = (req, res) => app(req, res);