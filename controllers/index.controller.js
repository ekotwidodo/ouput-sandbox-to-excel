const fs = require('fs')

const writeQuery = async (query, filename) => {
  try {
    const content = query
    await fs.writeFileSync(`./public/logs/${filename}.txt`, content)
  } catch (err) {
    console.log(err)
  }
}

const handleSpecialCharacters = (text) => {
  const source = typeof text === 'string' || text instanceof String ? text : ''
  return source.replace(/[&\/\\#, +$~%.'":*?<>{}]/g, '-')
}

module.exports = {

    index(req, res){
        res.render('index', {
            pageTitle: process.env.PAGE_TITLE,
            pageSubtitle: process.env.PAGE_SUBTITLE,
            pageDescription: process.env.PAGE_DESCRIPTION,
            footerDescription: process.env.FOOTER_DESCRIPTION,
            footerAuthorName: process.env.FOOTER_AUTHOR,
            footerAuthorUrl: process.env.FOOTER_AUTHOR_URL
        })
    },

    export(req, res){
        // Ambil data dari form
        const data = JSON.parse(req.body.data)
        // Ambil title dan query
        const title = data.title
        const query = data.text
        // Set timestamp
        const timestamp = new Date().getTime()
        // Buat nama file
        const filename = handleSpecialCharacters(`${title.split(' ').join('_')}_${timestamp}`)
        // 1. Simpan log query ke dalam folder query
        writeQuery(query, filename)
        res.status(200).json({ status: true, filename: filename })
    }
}