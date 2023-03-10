import express from 'express'
import compression from 'compression'
import formidable from 'formidable'
import { fileURLToPath } from 'url'
import { dirname, parse, sep } from 'path'

import { deepReadDir, statDir, cleanDir } from './cleaner.js'

function checkDigit(str) {
  	let hasNumber = /\d+/
  	return hasNumber.test(str)
}

function checkEmail(str) {
  	let isEmail = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
  	return (!isEmail.test(str))
}

const __dirname = dirname(fileURLToPath( import.meta.url )) + sep
const cfg = {
  	port: process.env.PORT || 9001,
  	dir: {
    	root: __dirname,
    	misc: __dirname + 'misc' + sep,
    	views: __dirname + 'views' + sep,
		uploads: __dirname + 'uploads' + sep
  	}
}

const app = express()                 // Express initiation
app.disable('x-powered-by')           // do not identify express
app.use( compression() )              // HTTP compression
app.set('view engine', 'ejs')         // Use EJS declaration
app.set('views', cfg.dir.views)       // Use EJS template 
// Srever static assets
app.use(express.static( cfg.dir.uploads ))

app.all('/', (req, res, next) => {    // Render form

	if (req.method === 'GET' || req.method === 'POST') {

		const form = formidable({
			multiples: true,
			uploadDir: cfg.dir.uploads,
			keepExtensions: true
		})

		// console.log('The uploaded Object:', JSON.stringify(form, null , 2))
		form.parse(req, (err, data, files) => {
			if (err) {
				next(err)
				return
			}
			if (files && files.image && files.image.size > 0) {
				data.filename = files.image.originalFilename
				data.filetype = files.image.mimetype
				data.filesize = Math.ceil(files.image.size / 1024) + ' KB'
				data.uploadto = files.image.filepath
				data.imageurl = '/' + parse(files.image.filepath).base
			}
			if (checkDigit(data.name) || data.name == '') {
				data.name = 'Wrong name input'
			}
			if (checkDigit(data.job) || data.job == '') {
				data.job = 'Wrong job input'
			}
			if (checkEmail(data.email)) {
				data.email = 'Wrong email input'
			}
			res.render('form', { title: 'Parse HTTP POST data', data })
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

let r = await cleanDir('uploads', 12)

app.listen(cfg.port, () => {          // Start server
  	console.log(`This application listening at http://localhost:${ cfg.port }`)
})