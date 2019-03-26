let express = require('express')
let os = require('os')
let fs = require('fs')
let path = require('path')
let serveStatic = require('serve-static')
let getImageSize = require('image-size')

const relativePath = 'images/tilesets/transparent'
const tilesetDirectory = path.resolve(__dirname, `../public/${relativePath}`)
let storedTilesets = []

function cacheTilesetsByDimension() {
	// ASCII IBM CODE PAGE 437 is always 16x16
	const columns = 16
	const rows = 16
	try {
		const files = fs.readdirSync(tilesetDirectory)
		for (let file of files) {
			const { width, height } = getImageSize(path.resolve(tilesetDirectory, file))
			storedTilesets.push({
				name: file,
				url: relativePath + `/${file}`,
				imageWidth: width,
				imageHeight: height,
				spriteWidth: width / columns,
				spriteHeight: height / rows
			})
		}
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

cacheTilesetsByDimension()

let app = express()
let port = process.env.PORT || 5000

app.use('/', express.static(path.join(__dirname, 'dist')))

app.get('/tilesets', (request, response) => {
	response.send({
		tilesetPath: relativePath,
		tilesets: storedTilesets
	})
})

app.listen(port)

console.log('Serving extended-ascii-previewer on port: ' + port)
