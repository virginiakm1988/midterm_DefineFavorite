const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
const ItemSchema = new Schema({
	picid: {
		type: String,
		required: [true, 'picid field is required.']
	},
	id: {
		type: String,
		required: [true, 'id field is required.']
	},
	web_name: {
		type: String,
		required: [true, 'web_name field is required.']
	},
	url: {
		type: String,
		required: [true, 'url field is required.']
	},
	des: String
})

// Creating a table within database with the defined schema
const Item = mongoose.model('item', ItemSchema)

// Exporting table for querying and mutating
module.exports = Item
