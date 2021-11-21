var express = require('express');
var router = express.Router();
const keycloak = require('../config/keycloak-config.js').getKeycloak();

/**
 * @swagger
 * /api/mymetric:
 *   get:
 *     description: Returns a custom metric
 *     responses:
 *       200:
 *         description: the metric
 */
router.get('/mymetric', keycloak.protect('et-first-role'), function(req, res){
    res.json({metric:350});
});

module.exports = router;
