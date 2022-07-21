const excel = require('exceljs')
const fs = require('fs')

const downloadFile = (url, destination) => {
    let file = fs.createWriteStream(destination)
    return new Promise((resolve, reject) => {
      let responseSent = false
      http.get(url, (resp) => {
        resp.pipe(file)
        file
          .on('finish', () => {
            file.close(() => {
              if (responseSent) return
              responseSent = true
              resolve()
            })
          })
          .on('error', (err) => {
            if (responseSent) return
            responseSent = true
            reject(err)
          })
      })
    })
  }  

module.exports = {

    index(req, res){
        res.render('index', {
            pageTitle: 'Export JSON ke Excel (Output Sandbox)',
        })
    },

    export(req, res){
        // Ambil data dari form
        const data = req.body.data
        const timestamp = req.body.timestamp
        // Setting excel
        const workbook = new excel.Workbook()
        const sheet = workbook.addWorksheet('data')
        // Masukkan datanya
        sheet.addRow().values = Object.keys(data[0])
        data.forEach(function(row) {
            let valRow = []
            valRow = Object.values(row)
            sheet.addRow().values = valRow
        })

        workbook.xlsx.writeFile(`./public/output-${timestamp}.xlsx`)
            .then(() => {
                res.status(200).json({ status: true })
        })
    }
}