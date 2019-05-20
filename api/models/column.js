const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
// const ColsSchema = new Schema({
// 	columns: {
//         ColSchema
//     },
//     // columnOrder: [String]
// })

const ColSchema = new Schema({
    id: String, 
    marks: [String]
})
// Creating a table within database with the defined schema
const column = mongoose.model('column', ColSchema)

// Exporting table for querying and mutating
module.exports = column

