const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    tokenNo:{
        type:String,
        required:true,
        unique:true
    },
    contact: {
        type: String,
        required: true,
    },
    batch: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: '',
    },
    skillset: {
        type: String,
        default: '',
    },
    company: {
        type: String,
        default: '',
    },
    experience: {
        type: String,
        default: '',
    },
    ctc: {
        type: String,
        default: '',
    },
    message: {
        type: String,
        required: true,
    },
    attachment: {
        type: String,
        default: '',
    },
}
);

const FormData = mongoose.model('FormData', formDataSchema);
module.exports = FormData;
