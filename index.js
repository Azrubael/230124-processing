import express from 'express'
import compression from 'compression'
import { fileURLToPath } from 'url'
import { dirname, sep } from 'path'
// import { MatchExpression } from './src/matchExpression.js'

function checkDigit(str) {
  	let hasNumber = /\d+/
  	return hasNumber.test(str)
}

const __dirname = dirname(fileURLToPath( import.meta.url )) + sep
const cfg = {
  	port: process.env.PORT || 9001,
  	dir: {
    	root: __dirname,
    	misc: __dirname + 'misc' + sep,
    	views: __dirname + 'views' + sep
  	}
}

// console.dir(cfg, { depth: null, color: true })

const app = express()                 // Express initiation
app.disable('x-powered-by')           // do not identify express
app.use( compression() )              // HTTP compression
app.set('view engine', 'ejs')         // Use EJS declaration
app.set('views', cfg.dir.views)       // Use EJS template 

// Srever static assets
app.use(express.static( cfg.dir.misc ))

// Body parsing
app.use(express.urlencoded({ extended: true }))

app.all('/', (req, res, next) => {    // Render form
	if (req.method === 'GET' || req.method === 'POST') {
		if (checkDigit(req.body.name) || req.body.name == '' || req.body.job == '') {
			req.body.name = 'Wrong input'
			req.body.job = 'Wrong input'
		}
		res.render('form', {
			title: 'Parse HTTP POST data',
			data: req.body
		})
	} else {
		next()
	}
})

app.get('/hello', (req, res) => {      // Page '/' route
  	res.render('message', { title: 'Hello, Azrubael!' })
})

app.use((req, res) => {
   res.status(404).send('Not found...')
})

app.listen(cfg.port, () => {          // Start server
  	console.log(`This application listening at http://localhost:${ cfg.port }`)
})

export { cfg, app }