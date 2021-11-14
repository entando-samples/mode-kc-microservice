var express = require('express');
var router = express.Router();

router.get('/mymetric', function(req, res){
    res.json({metric:350});
});

module.exports = router;
