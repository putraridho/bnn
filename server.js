const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql')
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bnn'
});

connection.connect()

app.get('/api/data_train', (req, res) => {
  connection.query('SELECT * FROM data_train', function (err, rows, fields) {
    if (err) throw console.log(err)
    res.json(rows)
  })
});

app.get('/api/questions', (req, res) => {
  connection.query('SELECT question FROM questions', function (err, rows, fields) {
    if (err) throw console.log(err)
    res.json(rows)
  })
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));