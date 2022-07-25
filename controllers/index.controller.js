const excel = require('exceljs')
const fs = require('fs')

const writeQuery = async (query, filename) => {
  try {
    const content = query
    await fs.writeFileSync(`./public/logs/${filename}.txt`, content)
  } catch (err) {
    console.log(err)
  }
} 

const formatJSON = (string) => {
  let formattedJSON = []
  // Get headers
  let headers = string.split('\n')[0].split('\t')
  // Get rows
  for (let i = 1; i < string.split('\n').length-1; i++) {
      let rows = {}
      for (let j = 0; j < string.split('\n')[i].split('\t').length; j++) {
          let items = string.split('\n')[i].split('\t')
          rows[headers[j]] = items[j]
      }

      formattedJSON.push(rows)
  }

  return formattedJSON
}

const handleSpecialCharacters = (text) => {
  const source = typeof text === 'string' || text instanceof String ? text : ''
  return source.replace(/[&\/\\#, +$~%.'":*?<>{}]/g, '-')
}

module.exports = {

    index(req, res){
        res.render('index', {
            pageTitle: 'Export JSON ke Excel (Output Sandbox)',
            pageSubtitle: 'Aplikasi ini dibangun dan dikembangkan oleh',
            pageAuthorName: 'Eko Teguh Widodo',
            pageAuthorUrl: 'https://github.com/ekotwidodo/output-sandbox-to-excel'
        })
    },

    export(req, res){
        // Ambil data dari form
        const data = JSON.parse(req.body.data)
        // Ambil output dan format ke dalam bentuk JSON
        const jsonData = formatJSON(data.results.msg[1].data)
        // Ambil title dan query
        const title = data.title
        const query = data.text
        // Set timestamp
        const timestamp = new Date().getTime()
        // Setting excel
        const workbook = new excel.Workbook()
        const sheet = workbook.addWorksheet('data')
        // Masukkan datanya
        sheet.addRow().values = Object.keys(jsonData[0])
        jsonData.forEach(function(row) {
            let valRow = []
            valRow = Object.values(row)
            sheet.addRow().values = valRow
        })

        // Buat nama file
        const filename = handleSpecialCharacters(`${title.split(' ').join('_')}_${timestamp}`)

        // 1. Simpan log query ke dalam folder query
        writeQuery(query, filename)

        // 2. Buat file excel dan simpan ke dalam files
        workbook.xlsx.writeFile(`./public/files/${filename}.xlsx`)
            .then(() => {
                res.status(200).json({ status: true, filename: filename })
        })
    }
}