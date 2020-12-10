const express = require('express')
const app = express()
const port = 4000
const cors = require('cors')
const bodyParser = require("body-parser")
const mongoose = require('mongoose');
const path = require('path')

app.use(cors())

app.use(express.static(path.join(__dirname, '../build')))
app.use('/static', express.static(path.join(__dirname, 'build//static')))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const myConnectionString = 'mongodb+srv://admin:1234@cluster0.ip4km.mongodb.net/movies?retryWrites=true&w=majority';
mongoose.connect(myConnectionString, { useNewUrlParser: true });

const Schema = mongoose.Schema;

var movieSchema = new Schema({
    title: String,
    year: String,
    poster: String
});

var movieModel = mongoose.model("movie", movieSchema);

app.get('/', (req, res) => {
    res.send("Hello World!")
})


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next()
});

app.get('/api/movies', (req, res) => {

    // const myovies = [
    //     {
    //         "Title": "Avengers: Infinity War",
    //         "Year": "2018",
    //         "imdbID": "tt4154756",
    //         "Type": "movie",
    //         "Poster": "https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_SX300.jpg"
    //     },
    //     {
    //         "Title": "Captain America: Civil War",
    //         "Year": "2016",
    //         "imdbID": "tt3498820",
    //         "Type": "movie",
    //         "Poster": "https://m.media-amazon.com/images/M/MV5BMjQ0MTgyNjAxMV5BMl5BanBnXkFtZTgwNjUzMDkyODE@._V1_SX300.jpg"
    //     },
    //     {
    //         "Title": "World War Z",
    //         "Year": "2013",
    //         "imdbID": "tt0816711",
    //         "Type": "movie",
    //         "Poster": "https://m.media-amazon.com/images/M/MV5BNDQ4YzFmNzktMmM5ZC00MDZjLTk1OTktNDE2ODE4YjM2MjJjXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg"
    //     },
    //     {
    //         "Title": "War of the Worlds",
    //         "Year": "2005",
    //         "imdbID": "tt0407304",
    //         "Type": "movie",
    //         "Poster": "https://m.media-amazon.com/images/M/MV5BNDUyODAzNDI1Nl5BMl5BanBnXkFtZTcwMDA2NDAzMw@@._V1_SX300.jpg"
    //     }
    // ];

    movieModel.find((err, data) => {
        res.json(data);
    })

    // res.status(200).json({
    //     message: "Everything is OK",
    //     movies: myovies
   // })
});

app.get('/api/movies/:id', (req,res) => {
    console.log(req.params.id);

    movieModel.findById(req.params.id, (err, data) => {
        res.json(data);
    })
})

app.put('/api/movies', (req,res) => {
    console.log("Update movie: " + req.params.id)
    console.log(req.body)

    movieModel.findByIdAndUpdate(req.param.id, req.body, {new:true},
        (error,data) => {
            res.send(data)
        })
})

app.post('/api/movies', (req, res) => {
    console.log('Movie Recieved!')
    console.log(req.body.title)
    console.log(req.body.year)
    console.log(req.body.poster)

    movieModel.create({
        title: req.body.title,
        year: req.body.year,
        poster: req.body.poster
    });

    res.send('Item Added');
})

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname + '/../build/index.html'))
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
}) 

app.delete('/api/movies/:id', (req,res) => {
    console.log("Delete Movie: " + req.params.id)

    movieModel.findByIdAndDelete(req.params.id, (err,data) => {
        res.send(data);
    })
})