// debit section
const debit = document.getElementById('debit')
const debitModal = new bootstrap.Modal(document.querySelector("div#debitModal"), {backdrop: 'static'})

debit.addEventListener('click', () => {
  debitModal.show()
})

const formDebit = document.querySelector("#debitModal form")
formDebit.addEventListener('submit', (e) => {

  axios.post('/input/debit', {
    tanggal: e.target.tanggal.value,
    transaksi: e.target.transaksi.value,
    debit: e.target.debit.value
  })
  .then((res) => {
    //remove tbody child
    const tbody = document.querySelector('#tbody')
    const length = tbody.children.length
    const debitFooter = document.querySelector("#footerDebit")
    const kreditFooter = document.querySelector("#footerKredit")
    const totalFooter = document.querySelector("#footerTotal")
    if(length > 0) {
      for(var i = 0; i < length; i++){
        tbody.removeChild(tbody.firstElementChild)
      }
    }

    res.data.table.forEach((item, i) => {
      const newRow = tbody.insertRow()
      newRow.innerHTML = `
        <td class="text-center">${i+1}</td>
        <td class="text-center">
          <button type="button" class="btn btn-primary" onclick="edit(${item.id})"><i class="fa fa-pencil"></i></button>
          <button type="button" class="btn btn-danger" onclick="hapus(${item.id})"><i class="fa fa-trash"></i></button>
        </td>
        <td class="text-center">${item.tanggal}</td>
        <td class="text-center">${item.transaksi}</td>
        <td class="text-end">${item.debit}</td>
        <td class="text-end">${item.kredit}</td>
        <td class="text-end">${item.total}</td>
      `
    })

    debitFooter.innerHTML = res.data.debit
    kreditFooter.innerHTML = res.data.kredit
    totalFooter.innerHTML = res.data.total

    e.target.tanggal.value = ""
    e.target.transaksi.value = ""
    e.target.debit.value = ""

    debitModal.hide()
  })
  .catch(err => console.log(err))

})

// kredit section 
const kredit = document.querySelector("#kredit")
const kreditModal = new bootstrap.Modal(document.querySelector("#kreditModal"), {backdrop: 'static'})

kredit.addEventListener('click', () => {
  kreditModal.show()
})

const formKredit = document.querySelector("#kreditModal form")
formKredit.addEventListener('submit', (e) => {
  e.preventDefault()
  const tanggal = e.target.tanggal.value
  const transaksi = e.target.transaksi.value
  const kredit = e.target.kredit.value

  axios.post("/input/kredit", {
    tanggal,
    transaksi,
    kredit
  })
  .then((res) => {
    const tbody = document.querySelector('#tbody')
    const length = tbody.childElementCount

    for(var i = 0; i < length; i++) {
      tbody.removeChild(tbody.firstElementChild)
    }

    res.data.table.forEach((item, a) => {
      const row = tbody.insertRow()
      row.innerHTML = `
        <td class="text-center">${a+1}</td>
        <td class="text-center">
          <button type="button" class="btn btn-primary" onclick="edit(${item.id})"><i class="fa fa-pencil"></i></button>
          <button type="button" class="btn btn-danger" onclick="hapus(${item.id})"><i class="fa fa-trash"></i></button>
        </td>
        <td class="text-center">${item.tanggal}</td>
        <td class="text-center">${item.transaksi}</td>
        <td class="text-end">${item.debit}</td>
        <td class="text-end">${item.kredit}</td>
        <td class="text-end">${item.total}</td>
      `
    })

    document.querySelector("#footerDebit").innerHTML = res.data.debit
    document.querySelector("#footerKredit").innerHTML = res.data.kredit
    document.querySelector("#footerTotal").innerHTML = res.data.total

    e.target.tanggal.value = ""
    e.target.transaksi.value = ""
    e.target.kredit.value = ""

    kreditModal.hide()
      
    // console.log(res)
  })
  .catch(err => console.log(err))
})

const modal = new bootstrap.Modal(document.getElementById('updateModal'),{backdrop: 'static'})
function edit(id){

  axios.post(`/update/${id}`, {
    id
  })
  .then((res) => {
    const value = res.data

    const id = document.querySelector("#updateModal input[name='id']")
    const tanggal = document.querySelector("#updateModal input[name='tanggal']")
    const transaksi = document.querySelector("#updateModal input[name='transaksi']")
    const debit = document.querySelector("#updateModal input[name='debit']")
    const kredit = document.querySelector("#updateModal input[name='kredit']")

    id.value = value.id
    tanggal.value = value.tanggal
    transaksi.value = value.transaksi
    debit.value = value.debit
    kredit.value = value.kredit

    // hide elements
    const hideDebit = document.getElementById('hideDebit')
    const hideKredit = document.getElementById('hideKredit')

    if(value.kredit === null) {
      hideKredit.style.display = "none"
      hideDebit.style.display = ""

      // remove required attibute
      document.querySelector("#updateModal input[name='debit']").setAttribute("required","required")
      document.querySelector("#updateModal input[name='kredit']").removeAttribute("required")
    } else {
      hideKredit.style.display = ""
      hideDebit.style.display = "none"

      // remove required attibute
      document.querySelector("#updateModal input[name='kredit']").setAttribute("required","required")
      document.querySelector("#updateModal input[name='debit']").removeAttribute("required")
    }

    modal.show()
  })
  .catch(err => console.log(err))
}

// update data
const formUpdate = document.querySelector("#updateModal form")
formUpdate.addEventListener('submit', (e) => {

  // form value
  const {id, tanggal, transaksi, debit, kredit} = e.target

  axios.put("/update/save", {
    id: id.value,
    tanggal: tanggal.value,
    transaksi: transaksi.value,
    debit: (debit.value === "") ? null : debit.value,
    kredit: (kredit.value === "") ? null : kredit.value
  })
  .then(data => {
    const {table} = data.data

    //remove tr tbody
    const length = tbody.children.length
    for(x = 0; x < length; x++) {
      tbody.removeChild(tbody.children[0])
    }

    //append tr
    table.forEach((tr, x) => {
      tbody.insertRow().innerHTML = `
        <td class="text-center">${x+1}</td>
        <td class="text-center">
          <button type="button" class="btn btn-primary" onclick="edit(${tr.id})"><i class="fa fa-pencil"></i></button>
          <button type="button" class="btn btn-danger" onclick="hapus(${tr.id})"><i class="fa fa-trash"></i></button>
        </td>
        <td class="text-center">${tr.tanggal}</td>
        <td class="text-center">${tr.transaksi}</td>
        <td class="text-end">${tr.debit}</td>
        <td class="text-end">${tr.kredit}</td>
        <td class="text-end">${tr.total}</td>
      `
    })

    // set footer value
    document.getElementById('footerDebit').innerHTML = data.data.debit
    document.getElementById('footerKredit').innerHTML = data.data.kredit
    document.getElementById('footerTotal').innerHTML = data.data.total

    // reset input value
    id.value = ""
    tanggal.value = ""
    transaksi.value = ""
    debit.value = ""
    kredit.value = ""

    modal.hide()
  })
  .catch(err => console.log(err))

})

function hapus(id) {
  if(confirm('Are you sure?')) {
    axios.delete(`/update/${id}`)
    .then(res => {
      const {table, debit, kredit, total} = res.data

      if(table !== null) {
        // remove child
        const length = tbody.childElementCount
        for(var x = 0; x < length; x++) {
          tbody.children[0].remove()
        }

        //append data
        table.forEach((item, i) => {
          const rows = tbody.insertRow()
          rows.innerHTML = `
            <td class="text-center">${i+1}</td>
            <td class="text-center">
              <button type="button" class="btn btn-primary" onclick="edit(${item.id})"><i class="fa fa-pencil"></i></button>
              <button type="button" class="btn btn-danger" onclick="hapus(${item.id})"><i class="fa fa-trash"></i></button>
            </td>
            <td class="text-center">${item.tanggal}</td>
            <td class="text-center">${item.transaksi}</td>
            <td class="text-end">${item.debit}</td>
            <td class="text-end">${item.kredit}</td>
            <td class="text-end">${item.total}</td>
          `
        })

        document.getElementById('footerDebit').innerHTML = debit
        document.getElementById('footerKredit').innerHTML = kredit
        document.getElementById('footerTotal').innerHTML = total
          
      } else {
        //remove child of tbody
        const length = tbody.childElementCount
        for(var x = 0; x < length; x++) {
          tbody.children[0].remove()
        }

        //append tbody row
        tbody.insertRow().innerHTML = '<td class="text-center" colspan="7">No Data Available</td>'

        document.getElementById('footerDebit').innerHTML = '-'
        document.getElementById('footerKredit').innerHTML = '-'
        document.getElementById('footerTotal').innerHTML = '-'
      }

    })
    .catch(err => console.log(err))
  }
}