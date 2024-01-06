const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        index: path.join(__dirname, 'src', 'index.js'),
        import: path.join(__dirname, 'src', 'import.js'),
        reservation: path.join(__dirname, 'src', 'reservation.js'),
        reservationWedding: path.join(__dirname, 'src', 'reservationWedding.js'),
        login: path.join(__dirname, 'src', 'login.js'),
        layout: path.join(__dirname,'src', 'layout.js')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    watch: true
}