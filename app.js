// third party libs
const express = require('express')
const app = express()

// node libs
const fileSystem = require('fs')

const PORT = 8000

app.set('view engine', 'pug') // setting pug as the default view engine

app.use('/static', express.static('public')) //can also be named assets
app.use(express.urlencoded({ extended: false }))
//localhost:8000
app.get('/', (req, res) => {
    fileSystem.readFile('./data/reviews.json', (err, data) => {
        if (err) throw err

        const reviews = JSON.parse(data)

        res.render('home', { reviews: reviews })
    })
    res.render('home')
})


app.post('/search', (req, res) => {
    const formData = req.body

    if (formData.search.trim() == '')
    {
        res.render('home', { error: true })
    }
    else
    {
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
