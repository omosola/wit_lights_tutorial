var express = require('express');
var request = require('request');
var router = express.Router();

var lights = [{ id: 1 }, { id: 2}];
var hue_url = 'http://192.168.1.169/api/newdeveloper/lights/';

router.put('/lights', function(req, res) {
  console.log(req.body.data)
  var command = JSON.parse(req.body.data);
  for (var i = 0; i < lights.length; i++) {
    request.put(hue_url + lights[i].id + '/state', { json: command.entity });
  }
  res.send(200);
});

router.put('/change_color', function(req, res) {
  var command = JSON.parse(req.body.data);
  for (var i = 0; i < lights.length; i++) {
    request.put(hue_url + lights[i].id + '/state', { json: command.entity });
  }
  res.send(200);
});

module.exports = router;
