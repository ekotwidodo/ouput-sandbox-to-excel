function handleChange (event, directValue) {
    // Get the value from jsonString input
    let jsonString= event.target.value
    // Parse jsonString into JSON formatted
    let jsonFormat = JSON.parse(jsonString)
    // Show the JSON formatted in jsonFormat input
    let jsonViewer = document.getElementById('jsonFormat')

    const options = {
        hoverPreviewEnabled: false,
        hoverPreviewArrayCount: 100,
        hoverPreviewFieldCount: 5,
        animateOpen: true,
        animateClose: true,
        theme: null, // or 'dark'
        useToJSON: true, // use the toJSON method to render an object as a string as available
        maxArrayItems: 100,
        exposePath: false
    }

    let formatter = new JSONFormatter(jsonFormat, 1, options)
    jsonViewer.innerHTML = ""
    jsonViewer.appendChild(formatter.render())

    // Show the JSON selected data into table
    let data = jsonFormat.data.results.msg[1].data
    let title = jsonFormat.data.title
    setJSONData(jsonFormat.data)
    showTable(formatJSON(data), title)
}

function setJSONData(data) {
    let jsonData = document.getElementById("jsonData")
    jsonData.value = JSON.stringify(data)
}

function showTable(data, title) {
    // Extract value for html header
    let col = []
    for (let i = 0; i < data.length; i++) {
        for (let key in data[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key)
            }
        }
    }
    // Create dynamic table
    let table = document.createElement("table")
    table.className = "table striped table-border mt-4"
    table.setAttribute("id", "dataTable")
    table.setAttribute("width", "100%")
    table.setAttribute("cellspacing", "0")

    // Create html table header row using the extracted headers above
    let header = table.createTHead()
    let row = header.insertRow(-1)

    for (let j = 0; j < col.length; j++) {
        let th = document.createElement("th")
        th.innerHTML = col[j]
        row.appendChild(th)
    }
    let totalRecord = 0
    // Add JSON data to the tables as rows
    let body = table.createTBody()
    for (let k = 0; k < data.length; k++) {
        tr = body.insertRow(-1)
        for (let l = 0; l < col.length; l++) {
            let tabCell = tr.insertCell(-1)
            tabCell.innerHTML = data[k][col[l]]
        }
        totalRecord+=1
    }
    // Finally add the newlu created table 
    let divContainer = document.getElementById("showTable")
    divContainer.innerHTML = ""
    // add title before table
    let p = document.createElement("p")
    p.className = "text-center"
    p.innerHTML = "<strong>" + title + "</strong>"
    divContainer.appendChild(p)
    // append table
    divContainer.appendChild(table)
    // add total records
    let pContainer = document.getElementById("totalRecord")
    pContainer.innerHTML = "Total Record: <b>" + totalRecord + " records</b>"
}

function formatJSON(string) {
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

// Add download excel function using XLSX library
function downloadExcel(filename) {
    let table = document.getElementById("dataTable")
    let file = XLSX.utils.table_to_book(table, {sheet: "data"})
    XLSX.write(file, {bookType: 'xlsx', bookSST: true, type: 'base64'})
    XLSX.writeFile(file, `${filename}.xlsx`)
}

async function postData (url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    const resData = await response.json()
    return resData
}

let formExport = document.getElementById("form-export")
formExport.addEventListener("submit", function(event) {
    event.preventDefault()
    let jsonData = document.getElementById("jsonData").value
    let formData = {
        data: jsonData
    }
    
    postData('/export', formData)
        .then(result => {
            if (result.status) {
                downloadExcel(result.filename)
            }
        })
        .catch(err => console.log(err))
})

function handleInfo(footerDescription, footerAuthorName, footerAuthorUrl) {
    let infoContent = `
    <h3>Informasi Aplikasi</h3>
    <p>${footerDescription}</p>
    <p>
        Pembangunan dan pengembangan aplikasi tersebut dapat dilihat melalui <a href="${footerAuthorUrl}" target="_blank" style="text-decoration:none;">Link Github</a>.
    </p>
    <p>-${footerAuthorName}</p>
    `
    Metro.infobox.create(infoContent)
}