var express = require('express');
var router = express.Router();

const responseBody = {"status":"UP"}

router.get('/health', function(req, res){
    res.status(200).json(responseBody)
});

module.exports = router;
