"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// ROUTER INDEX:

// URL: /

// auth:
router.use('/auth', require('./auth'))
// user:
router.use('/users', require('./user'))
// token:
router.use('/tokens', require('./token'))

// reservation:
router.use('/reservations', require('./reservation'))
// car:
router.use('/cars', require('./car'))


// document:
router.use('/documents', require('./document'))

/* ------------------------------------------------------- */
module.exports = router