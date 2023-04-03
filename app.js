// third party libs
const express = require('express')
const id = require('uniqid')
const jsdom = require('jsdom')
const { JSDOM } = jsdom;
const app = express()
let bookData = [];
// node libs
const fileSystem = require('fs')
const path = require('path');
const { error } = require('console');

const PORT = 8000
global.document = new JSDOM('search').window.document

app.set('views', './views');
app.set('view engine', 'pug') // setting pug as the default view engine
//can also be named assets
app.use("/public", express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: false }))


//localhost:8000
app.get('/', (req, res) => {
    let added = req.query.added
    let reviews = getAll('reviews')
    let activeReviews = reviews.filter(review => review.deleted == "false")
    if (added)
    {
        res.render('home', { reviews: activeReviews, added: true })
        
    }
    else
    {
        res.render('home', { reviews: activeReviews, added: false})
    }
      
})
app.get('/:id/add', (req, res) => {
    const book_id = req.params.id

    fileSystem.readFile('./data/books.json', (err, data) => {
        if (err) throw err

        const books = JSON.parse(data)
        const book = books.find(book => book.id == book_id)
        res.render('add', { book: book })
    })
})
app.get('/:id/update', (req, res) => {
    const review_id = req.params.id

    fileSystem.readFile('./data/reviews.json', (err, data) => {
        if (err) throw err

        const reviews = JSON.parse(data)
        const review = reviews.find(review => review.id == review_id)
        res.render('update', { review: review })
    })
})
app.post('/:id/update', (req, res) => {
    const formData = req.body
    const id = req.params.id
    
    let updatedReview = {
        id: id,
        name: formData.name,
        rating: formData.rating,
        title: formData.title,
        imageLink: formData.imageLink,
        description: formData.description,
        deleted: "false"
    }

    fileSystem.readFile('./data/reviews.json', (err, data) => {
        if (err) throw err

        const reviews = JSON.parse(data)
        const selectedReview = reviews.find(review => review.id == id)
        const reviewId = reviews.indexOf(selectedReview)
        let splicedReview = reviews.splice(reviewId, 1)[0]
        splicedReview = updatedReview
        reviews.push(splicedReview)

        fileSystem.writeFile('./data/reviews.json', JSON.stringify(reviews), (err) => {
            if (err) throw err

            res.render('home', { reviews: reviews, updated:true })

        })
    })

})
app.get('/:id/delete', (req, res) => {
    //TODO: confirm the deletion using a prompt
    const review_id = req.params.id

    fileSystem.readFile('./data/reviews.json', (err, data) => {
        if (err) throw err

        const reviews = JSON.parse(data)
        let deletedReview = reviews.find(review => review.id == review_id)
        deletedReview.deleted = "true"
        const reviewId = reviews.indexOf(deletedReview)
        let splicedReview = deletedReview
        reviews.push(splicedReview)
        const filteredReviews = reviews.filter(review => review.deleted == "false")
        
        fileSystem.writeFile('./data/reviews.json', JSON.stringify(reviews), (err) => {
            if (err) throw err

            res.render('home', {reviews:filteredReviews, deleted: true})
        })
        
    })
})

app.get('/search', (req, res) => {
    
    let books = getAll('books')
    res.render('search', { books: books })
    
    
})

app.post('/add', (req, res) => {
    let formData = req.body
    const books = getAll('books')
    if (formData.description.trim() == '') 
    {
        res.render('search', { books:books, error_desc: true })
        
    }
    else if (formData.name.trim() == '')
    {
        res.render('search', { books:books, error_name: true})
    }
    else
    {
        let review = {
            id: id(),
            title: formData.title,
            imageLink: formData.imageLink,
            name: formData.name,
            rating: formData.rating,
            description: formData.description,
            deleted: "false"
        }
    
        let reviews = getAll('reviews')
    
        reviews.push(review)
        writeAll('reviews', reviews)
        res.redirect('/?added=true')
        
    }
})

function getAll(filename) {
    return JSON.parse(fileSystem.readFileSync(`./data/${filename}.json`))
}
function writeAll(filename, data) {
    return fileSystem.writeFileSync(`./data/${filename}.json`, JSON.stringify(data))
}
app.post('/search', (req, res) => {
    const books = getAll('books')
    const formData = req.body
    const str = formData.search
    if (str.trim() == '')
    {
        res.render('search', { books: books, error: true })
    }
    else
    {
        //TODO: filter out the available books depending on the typed out text. Should we use javascript for front?
        //read is similar to establishing connection to the database
        fileSystem.readFile('./data/books.json', (err, data) => {
            if (err) throw err

            //JSON.parse creates a javascript object from the string data in the json file 
            const books = JSON.parse(data)
            const filteredBooks = books.filter(book => book.title.toLowerCase().includes(str.toLowerCase()))
            //We need to show the object(s) with the title or author that is similar to the value typed in the search
            // field and if there are none, no items should be displayed
            let n = filteredBooks.length;
            res.render('search', { books: filteredBooks, n, searched: true})
            //we are not creating any review object. This is just filtering so far.
        })
    }

})
app.listen(PORT, (err) => {
    if (err) throw err

    console.log(`This app is running in https://localhost:${PORT}`)
})
