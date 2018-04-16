port = 3000
clientAddress = 'http://localhost:8000';




const express = require('express');
const app = express();




// Avoid COORS Issues
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', clientAddress);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Server endpoints
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => console.log('Server listening on port ' + port + '!'));
