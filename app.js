// third party libs
const express = require('express')
const app = express()

// node libs
const fileSystem = require('fs')
const path = require('path')

const PORT = 8000


app.set('views', './views');
app.set('view engine', 'pug') // setting pug as the default view engine
//can also be named assets
app.use("/public", express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: false }))


//localhost:8000
app.get('/', (req, res) => {
    let q = req.query.added

    // if (added)
    // {
        fileSystem.readFile('./data/reviews.json', (err, data) => {
            if (err) throw err
    
            let reviews = JSON.parse(data)
    
            res.render('home', { reviews: reviews })
        })
    //}
    // else
    // {
    //     res.render('home', {})
    // }
      
})

//TODO: work on add! 31.03.2023 Show the list of available books and show the chosen book
app.get('/search', (req, res) => {
    
    fileSystem.readFile('./data/books.json', (err, data) => {
        if (err) throw err

        let books = JSON.parse(data)

        res.render('search', { books: books })
    })
    //res.render('add', {books: books})
})
app.get('/add', (req, res) => {
    res.render('add', {})
})
app.post('/add', (req, res) => {
    let formData = req.body
    
    if (formData.description.trim() == '' || formData.name.trim() == '')
    {
        res.render('add', { error: true })
        //A specific error message?
    }
    else
    {
        let review = {
            name: data.name,
            rating: data.rating,
            description: data.description
        }
    
        let reviews = getAll('reviews')
    
        reviews.push(review)
        writeAll('reviews', reviews)
        res.redirect('/?added=true')
        //The old version. Check the above, might be better
        fileSystem.readFile('./data/reviews.json', (err, data) => {
            if (err) throw err

            //JSON.parse creates a javascript object from the string data in the json file 
            const reviews = JSON.parse(data)
            //We need to show the object(s) with the title or author that is similar to the value typed in the search
            // field and if there are none, no items should be displayed
            
            //we are not creating any review object. This is just filtering so far.
        })
    }
})

function getAll(filename) {
    return JSON.parse(fileSystem.readFileSync(filename))
}
function writeAll(filename, data) {
    return JSON.stringify(fileSystem.writeFileSync(filename, data))
}
app.post('/search', (req, res) => {
    const formData = req.body

    if (formData.search.trim() == '')
    {
        res.render('search', { error: true })
    }
    else
    {
        //TODO: filter out the available books depending on the typed out text. Should we use javascript for front?
        //read is similar to establishing connection to the database
        fileSystem.readFile('./data/reviews.json', (err, data) => {
            if (err) throw err

            //JSON.parse creates a javascript object from the string data in the json file 
            const reviews = JSON.parse(data)
            //We need to show the object(s) with the title or author that is similar to the value typed in the search
            // field and if there are none, no items should be displayed
            
            //we are not creating any review object. This is just filtering so far.
        })
    }

})
app.listen(PORT, (err) => {
    if (err) throw err

    console.log(`This app is running in port ${PORT}`)
})
