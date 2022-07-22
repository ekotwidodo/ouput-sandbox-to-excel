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
    setJSONData(jsonFormat.data)
    showTable(formatJSON(data))
}

function setJSONData(data) {
    let jsonData = document.getElementById("jsonData")
    jsonData.value = JSON.stringify(data)
}

function showTable(data) {

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

    // Create html table header row using the extracted headers above
    let tr = table.insertRow(-1)

    for (let j = 0; j < col.length; j++) {
        let th = document.createElement("th")
        th.innerHTML = col[j]
        tr.appendChild(th)
    }

    // Add JSON data to the tables as rows
    for (let k = 0; k < data.length; k++) {
        tr = table.insertRow(-1)
        for (let l = 0; l < col.length; l++) {
            let tabCell = tr.insertCell(-1)
            tabCell.innerHTML = data[k][col[l]]
        }
    }

    // Finally add the newlu created table 
    let divContainer = document.getElementById("showTable")
    divContainer.innerHTML = ""
    divContainer.appendChild(table)
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
                window.location = `./download/${result.filename}.xlsx`
            }
        })
        .catch(err => console.log(err))
})