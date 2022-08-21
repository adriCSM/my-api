const express = require('express');
const router = express.Router();
const API = require('../controller/api');

router.get('/user', API.UserById);
router.get('/', API.getAllJudul);
router.post('/registrasi', API.registrasi);
router.post('/add-judul', API.addJudul);
router.patch('/tolak-judul', API.tolakJudul);
router.patch('/terima-judul', API.terimaJudul);
router.delete('/delete', API.deleteUserAndJudul);

module.exports = router;
