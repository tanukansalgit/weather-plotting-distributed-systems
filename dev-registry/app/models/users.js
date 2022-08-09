
const mongoose = require("mongoose");

/**
 * @type {Model}
 */
const userSchema = new mongoose.Schema({
	firstName: { type: String },
	lastName: { type: String, default: "" },
	password: { type: String,trim: true, required:true },
	email: {type: String,trim: true, unique:true },
	sessionToken : { type: String }
},{timestamps : true});

module.exports = mongoose.model( "users" , userSchema );

