var express = require('express');
var router = express.Router();
var request = require('request');

var lights = [{ id: 1 }, { id: 2}];
var hue_url = 'http://<HUE_BRIDGE_IP_ADDRESS>/api/newdeveloper/lights/';

router.put('/lights', function(req, res) {
    var command = JSON.parse(req.body.data);
    for (var i = 0; i < lights.length; i++) {
        request.put(hue_url + lights[i].id + '/state', { json: command.entity });
    }
});

router.put('/change_color', function(req, res) {
    var command = JSON.parse(req.body.data);
    for (var i = 0; i < lights.length; i++) {
        request.put(hue_url + lights[i].id + '/state', { json: command.entity });
    }
});

module.exports = router;
