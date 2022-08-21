const user = require('../model/user');
const judul = require('../model/judul');
module.exports = class API {
    /**--------------------------------Registrase --------------------------------*/
    static async registrasi(req, res) {
        const { nama, nim, noHp, email, password } = req.body;
        const userExist = await user.findOne({ nim });
        if (!userExist) {
            await user
                .insertMany({ nama, nim, noHp, email, password })
                .then((data) => {
                    res.status(200).json({
                        message: 'Registration is successfully',
                    });
                })
                .catch((err) => {
                    res.status(400).json({ message: err.message });
                });
        } else {
            res.status(400).json({
                message: `User Sudah Ada Dengan Nim ${nim}`,
            });
        }
    }

    /**----------------------------Add Judul & populate----------------------------------*/
    static async addJudul(req, res) {
        const _id = req.query._id;
        const { file_krs, judul1, resume1, judul2, resume2 } = req.body;
        const cekStatus = await user.findOne({
            $or: [
                { _id, status: 'Di setujui' },
                {
                    _id,
                    status: 'Dalam proses review',
                },
            ],
        });
        if (!cekStatus) {
            const createJudul = await judul.create({
                file_krs,
                judul1,
                resume1,
                judul2,
                resume2,
            });

            await user
                .findOneAndUpdate(
                    { _id },
                    {
                        status: 'Dalam proses review',
                        $push: {
                            judul: createJudul._id,
                        },
                    },
                    {
                        new: true,
                    }
                )
                .then(async (e) => {
                    const data = await user.findOne({ _id }).populate('judul');
                    res.status(200).json({
                        message: 'Create judul is successfully',
                    });
                })
                .catch((err) => {
                    res.status(401).json({ message: err.message });
                });
        } else {
            if (cekStatus.status === 'Di setujui') {
                res.status(400).json({
                    message: 'Judul sudah di setujui',
                });
            } else {
                res.status(400).json({
                    message: 'Judul sudah ada dan sedang di review',
                });
            }
        }
    }

    /**-----------------------------------Get All User & judul---------------------------------*/

    static async getAllJudul(req, res) {
        await user
            .find()
            .populate(['judul'])
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                res.status(404).json({ message: err.message });
            });
    }

    /**-------------------------------Get  All User  By query id --------------------------------*/
    static async UserById(req, res) {
        const _id = req.query.id;
        try {
            const data = await user.find({ _id }).populate('judul');

            res.status(200).json(data);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    /**---------------------------------tolakjudul -------------------------------------*/

    static async tolakJudul(req, res) {
        const _id = req.query._id;
        const cekUser = await user.findOneAndUpdate(
            { _id },
            {
                status: 'Ditolak',
            }
        );
        if (cekUser) {
            await judul
                .findByIdAndUpdate(
                    {
                        _id: cekUser.judul[cekUser.judul.length - 1],
                    },
                    {
                        status: 'Ditolak',
                    },
                    {
                        new: true,
                    }
                )
                .then(() => {
                    res.status(201).json({ message: 'Berhasil menolak judul' });
                });
        } else {
            res.status(400).json({ message: 'Id tidak ditemukan' });
        }
    }

    /**---------------------------------terimajudul -------------------------------------*/

    static async terimaJudul(req, res) {
        const _id = req.query._id;
        const cekUser = await user.findOneAndUpdate(
            { _id },
            {
                status: 'Di setujui',
            }
        );
        if (cekUser) {
            await judul
                .findByIdAndUpdate(
                    {
                        _id: cekUser.judul[cekUser.judul.length - 1],
                    },
                    {
                        status: 'Di setujui',
                    },
                    {
                        new: true,
                    }
                )
                .then(() => {
                    res.status(201).json({
                        message: 'Berhasil menerima judul',
                    });
                });
        } else {
            res.status(400).json({ message: 'Id tidak ditemukan' });
        }
    }

    /**---------------------------------Delete User And Judul -------------------------------------*/

    static async deleteUserAndJudul(req, res) {
        const _id = req.body._id;
        const findUser = await user.findOneAndDelete({ _id });

        if (findUser) {
            try {
                findUser.judul.map(async (d) => {
                    await judul.findOneAndDelete({ _id: d });
                });
                res.status(201).json({
                    message: 'Berhasil menghapus judul',
                });
            } catch (err) {
                res.status(401).json({ message: err.message });
            }
        } else {
            res.status(400).json({ message: 'Id tidak ditemukan' });
        }
    }
};
