const express = require('express')
const morgan = require('morgan')
const sql = require('./sql')
const model = require('./model')
const monthCalendar = require('./monthCalendar')
const app = express()

app.listen(8080)

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// use static files
app.use(express.static('public'))

app.set('view engine', 'ejs')
app.set('views', 'template')

app.get("/" , (req, res) => {
	const [tahun, bulan] = new Date().toLocaleString('fr-CA', {timeZone: 'Asia/Jakarta'}).split(", ")[0].split("-")
	const query = `select * from pembukuan where month(tanggal) = ${bulan} and year(tanggal) = ${tahun} order by tanggal asc`
	model(query, (data) => {
		let month = [];
		for(var x = 1; x <= 12; x++) {
			month[x] = monthCalendar(x)
		}
		res.render('index', {data: data, month: month, bulan: bulan, tahun: tahun})
	})
})

app.post("/input/debit", (req, res) => {
	const total = req.body.debit
	const query = `insert into pembukuan (tanggal, transaksi, debit, total) value('${req.body.tanggal}', '${req.body.transaksi}', ${req.body.debit}, ${total})`

	sql('akuntansi', query, (error, re) => {
		if(error) throw error;

		const [tahun, bulan, tanggal] = req.body.tanggal.split("-")

		model(`select * from pembukuan where month(tanggal) = ${bulan} and year(tanggal) = ${tahun} order by tanggal asc`, (data) => {
			res.json(data)
		})
	})

})

app.post("/input/kredit", (req, res) => {
	const total = -(req.body.kredit)
	const query = `insert into pembukuan (tanggal, transaksi, kredit, total) value('${req.body.tanggal}', '${req.body.transaksi}', ${req.body.kredit}, ${total})`

	sql('akuntansi', query, (error, re) => {
		if(error) throw error;

		const [tahun, bulan, tanggal] = req.body.tanggal.split("-")

		model(`select * from pembukuan where month(tanggal) = ${bulan} and year(tanggal) = ${tahun} order by tanggal asc`, (data) => {
			res.json(data)
		})
	})

})

app.post("/update/:id", (req, res) => {
	const id = req.body.id
	sql('akuntansi', `select * from pembukuan where id = ${id}`, (err, data) => {
		if(err) throw err;
		const {id, tanggal, transaksi, debit, kredit, total} = data[0]
		const date = tanggal.toLocaleString('fr-CA', {timeZone: 'Asia/Jakarta'}).split(", ")[0]
		res.json({
			id,
			tanggal: date,
			transaksi,
			debit,
			kredit
		})
	})
})

app.put("/update/save", (req, res) => {
	const {id, tanggal, transaksi, debit, kredit} = req.body
	const total = (debit === null) ? -(kredit) : debit
	const query1 = `update pembukuan set tanggal = '${tanggal}', transaksi = '${transaksi}', debit = ${debit}, total = ${total} where id = ${id}`
	const query2 = `update pembukuan set tanggal = '${tanggal}', transaksi = '${transaksi}', kredit = ${kredit}, total = ${total} where id = ${id}`
	const query = (debit === null) ? query2 : query1

	const [tahun, bulan] = tanggal.split("-")

	const getData = `select * from pembukuan where month(tanggal) = ${bulan} and year(tanggal) = ${tahun} order by tanggal asc`

	sql('akuntansi', query, (err, data) => {
		if(err) throw err;

		model(getData, (data) => {
			res.json(data)
		})
	})
})

app.delete("/update/:id", (req, res) => {
	const id = req.params.id
	sql('akuntansi', `delete from pembukuan where id = ${id}`, (error, result) =>{
		if (error) throw error

		const [tahun, bulan] = new Date().toLocaleString('fr-CA', {timeZone: 'Asia/Jakarta'}).split(", ")[0].split("-")

		const getData = `select * from pembukuan where month(tanggal) = ${bulan} and year(tanggal) = ${tahun} order by tanggal asc`
		model(getData, (data) => {
			res.json(data)
		})
	})
})

app.post("/filter", (req, res) => {
	// res.json(req.body)
	const {bulan, tahun} = req.body
	const query = `select * from pembukuan where month(tanggal) = ${bulan} and year(tanggal) = ${tahun} order by tanggal asc`

	model(query, (data) => {
		res.json(data)
	})
})