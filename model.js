const sql = require('./sql')

const model = (query, callback) => {

	const format = new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'})
	sql('akuntansi', query, (error, response) => {
		if(error) throw error

		let result = []
		let debitArray = []
		let kreditArray = []
		let totalArray = []

		response.forEach((value, index) => {
			debitArray[index] = (value.debit === null) ? 0 : value.debit
			kreditArray[index] = (value.kredit === null) ? 0 : value.kredit
			totalArray[index] = value.total

			const sumTotal = totalArray.reduce((a,b) => {return a+=b}, 0)

			result[index] = {
				id: value.id,
				tanggal: value.tanggal.toLocaleString('en-GB', {timeZone: 'Asia/Jakarta'}).split(', ')[0].split("/").join("-"),
				transaksi: value.transaksi,
				debit: (value.debit !== null) ? format.format(value.debit) : format.format(0),
				kredit: (value.kredit !== null) ? format.format(value.kredit) : format.format(0),
				total: format.format(sumTotal)
			}
		})

		const totalDebit = debitArray.reduce((a,b) => {return a+b},0)
		const totalKredit = kreditArray.reduce((a,b) => {return a+b},0)
		const countValue = totalDebit - totalKredit

		const hasil = {
			table: (result.length > 0) ? result : null,
			debit: (result.length > 0) ? format.format(totalDebit) : null,
			kredit: (result.length > 0) ? format.format(totalKredit) : null,
			total: (result.length > 0) ? format.format(countValue) : null
		}

		return callback(hasil)

	})
	
}

module.exports = model