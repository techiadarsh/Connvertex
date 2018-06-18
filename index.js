const weather = require('./weather.js');
const http = require('http');
const express = require('express');

const app = express();

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/form.html');
});

app.get('/submit',(req,res) => {
  weather
  .fetch(req.query.A,req.query.X,req.query.C)
  .then(response=>{res.write(response);res.end();})
  .catch(error=>{console.log(error);res.end();});
});
  
app.listen(8080);