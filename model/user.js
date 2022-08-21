const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const moment = require('moment');

const user = mongoose.model(
    'user',
    mongoose
        .Schema(
            {
                nama: {
                    type: String,
                    required: true,
                },
                nim: {
                    type: String,
                    required: true,
                    unique: true,
                },
                noHp: {
                    type: String,
                    required: true,
                },
                email: {
                    type: String,
                    required: true,
                },
                password: {
                    type: String,
                    required: true,
                },

                pic: {
                    type: String,
                    default:
                        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
                },
                judul: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'judul',
                    },
                ],

                status: {
                    type: String,
                    default: 'kosong',
                },
            },
            {
                timestamps: true,
            }
        )
        .pre('insertMany', async (next, doc) => {
            if (doc) {
                const salt = await bcrypt.genSalt(10);
                doc.password = await bcrypt.hash(doc.password, salt);
            }
            next();
        })
);

module.exports = user;
