const express = require('express');
const router = require("express").Router();
const path = require('path');

// Serve static files from the Angular app
router.use(express.static(path.join(__dirname, '/../../dist/charter-manago/browser/')));

// router.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/../../dist/charter-manago/browser/index.html'));
// });

module.exports = router;
