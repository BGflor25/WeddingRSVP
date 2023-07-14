const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        index: path.join(__dirname, 'src', 'index.js'),
        import: path.join(__dirname, 'src', 'import.js'),
        reservation: path.join(__dirname, 'src', 'reservation.js')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    watch: true
}