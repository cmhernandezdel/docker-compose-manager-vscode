const express = require('express');

const app = express();

app.get('/', (_req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});