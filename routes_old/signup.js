var express = require('express');
var router = express.Router();

/* GET signup page. */
router.get('/singup', function(req, res, next) {
    res.render('/singup', { title: 'Sing-up-js' });
});

module.exports = router;
