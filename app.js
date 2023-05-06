const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const routes = require('./routes');
const connectDatabase = require('./config/db')
const dotenv = require('dotenv')
const path = require('path')
let cors = require("cors");



const app = express()
app.use(cors());
app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))
app.use(fileUpload())
app.set('view engine', 'html');
app.set('trust proxy', true)
mongoose.set('strictQuery', true)
app.use('/api/v1', routes);
console.log(__dirname)
app.use(express.static(path.join('public')));

// set the view engine to ejs
// app.set('view engine', 'ejs');

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(express.static('public'))


dotenv.config({path:".env"});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is up at port ${port}`);
  connectDatabase();
}); 