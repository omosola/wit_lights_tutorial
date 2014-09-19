var express = require('express');
var router = express.Router();
var request = require('request');

var hue_url = 'http://192.168.1.110/api/newdeveloper/lights/2/state';

router.put('/lights', function(req, res) {
    var command = JSON.parse(req.body.data);
    request.put(hue_url, { json: command.entity });
});

router.put('/change_color', function(req, res) {
    var command = JSON.parse(req.body.data);
    request.put(hue_url, { json: command.entity });
});

module.exports = router;
