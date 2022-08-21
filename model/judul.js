const mongoose = require('mongoose');
const moment = require('moment');

const judul = mongoose.model(
    'judul',
    mongoose.Schema({
        file_krs: {
            type: String,
            required: true,
        },
        judul1: {
            type: String,
            required: true,
        },
        resume1: {
            type: String,
            required: true,
        },
        judul2: {
            type: String,
            required: true,
        },
        resume2: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: 'Dalam proses review',
        },

        createdAt: {
            type: String,
            default: moment().locale('id').format('dddd, L'),
        },
    })
);

module.exports = judul;
