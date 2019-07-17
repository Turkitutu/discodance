const express = require('express'),
      app = express();

require('./server');

app.use(express.static('public'));

app.listen(8080, () => {
    console.log('listening');
});