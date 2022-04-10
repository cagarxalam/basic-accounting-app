const monthCalendar = (month) => {
	let bulan;
	let num;
	switch(month) {
		case 1:
			bulan = 'Januari'
			num = '01'
			break
		case 2:
			bulan = 'Februari'
			num = '02'
			break
		case 3:
			bulan = 'Maret'
			num = '03'
			break
		case 4:
			bulan = 'April'
			num = '04'
			break
		case 5:
			bulan = 'Mei'
			num = '05'
			break
		case 6:
			bulan = 'Juni'
			num = '06'
			break
		case 7:
			bulan = 'Juli'
			num = '07'
			break
		case 8:
			bulan = 'Agustus'
			num = '08'
			break
		case 9:
			bulan = 'September'
			num = '09'
			break
		case 10:
			bulan = 'Oktober'
			num = '10'
			break
		case 11:
			bulan = 'November'
			num = '11'
			break
		case 12:
			bulan = 'Desember'
			num = '12'
			break
	}
	return {bulan, num}
}

module.exports = monthCalendar