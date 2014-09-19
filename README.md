## Wit.ai Lights Tutorial

Create a voice controlled command center for Hue Smart Lights powered by Wit.ai.

## Prerequisites

Microphone relies on WebRTC, which works on Chrome, Firefox and Opera right now. Safari and IE don't support WebRTC yet.

You should also have npm and Node.js installed as well as your Hue Bridge and Light system set up.

#### Other Useful Info
* https://wit.ai
* https://wit.ai/docs
* [Web SDK](https://github.com/wit-ai/wit-widgets/releases/tag/0.4.0)
* [Philips Hue Docs](http://www.developers.meethue.com/documentation/getting-started)
* help@wit.ai

## Create Your Wit.ai Instance

Log into Wit.ai and create a new instance. In your instance, create your first intent by typing the expression "Turn on the light" in the input box. 

Give the expression the intent "lights" and assign the pre-made entity "wit/on_off."

Confirm the intent and enter a few similar expressions for turning on or off a light.

Under settings, use the cURL generator to create a cURL to connect with the Wit API.

## Setup the App

Install Express and other dependencies and create the Express app.

```bash
npm install express
npm install -g express-generator
cd path/to/project
express --ejs wit_lights_tutorial
cd wit_lights_tutorial
npm install request --save
npm install
```

Use `npm start` to run the server and navigate your browser to `localhost:3000` to see it in action.

In `app.js`, change `./routes/users` to `./routes/api`.

```javascript
var routes = require('./routes/index');
var api = require('./routes/api');

...

app.use('/', routes);
app.use('/api', api);
```
Change name of the `users.js` file to `api.js`.

## Add the Wit Microphone to Your App

Download the [SDK](https://github.com/wit-ai/wit-widgets/releases/tag/0.4.0) and unzip it. Move the `microphone.js` to `public/javascripts` and `microphone.css` and the `fonts` directory to `public/stylesheets`.

In `views/index.ejs` add the following: 

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel='stylesheet' href='/stylesheets/style.css' />
    <link rel='stylesheet' href='/stylesheets/microphone.css' />
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script type="text/javascript" src='/javascripts/microphone.js'></script>
    <script type="text/javascript" src='/javascripts/scripts.js'></script>
  </head>
  <body>
    <h1>Hue Command and Control</h1>
    <div id='microphone'></div>
    <pre id='result'></pre>
    <div id='info'></div>
  </body>
</html>
```
in `public/javascripts/scripts.js`

```javascript
$(document).ready(function () {
  var mic = new Wit.Microphone(document.getElementById("microphone"));
  var info = function (msg) {
    document.getElementById("info").innerHTML = msg;
  };
  mic.onready = function () {
    info("Microphone is ready to record");
  };
  mic.onaudiostart = function () {
    info("Recording started");
  };
  mic.onaudioend = function () {
    info("Recording stopped, processing started");
  };
  mic.onerror = function (err) {
    info("Error: " + err);
  };
  mic.onresult = function (intent, entities) {
    var r = kv("intent", intent);

    for (var k in entities) {
      var e = entities[k];

      if (!(e instanceof Array)) {
        r += kv(k, e.value);
      } else {
        for (var i = 0; i < e.length; i++) {
          r += kv(k, e[i].value);
        }
      }
    }

    document.getElementById("result").innerHTML = r;
  };
  mic.connect("INSERT YOUR CLIENT TOKEN");
  // mic.start();
  // mic.stop();

  function kv (k, v) {
    if (toString.call(v) !== "[object String]") {
      v = JSON.stringify(v);
    }
    return k + "=" + v + "\n";
  }
});
```
Go to your Wit.ai Developer Console, go to the settings tab for your instance. Generate a client token and replace `"INSERT YOUR CLIENT TOKEN"` above with your client token.

Run `npm start` and navigate to `localhost:3000` to see your app in action.

## Turn the Lights On and Off

In `public/javascripts/scripts.js` add the following code to grab and format the data coming back from Wit.ai.

```javascript
...

mic.onresult = function (intent, entities) {
  var result = 'WAT?!';
  if (intent == 'lights') {
    var value = entities.on_off && entities.on_off.value;
    if (value == 'on' || value == 'off') {
      result = 'Turing the lights ' + value;
      sendRequest(
        'api/lights',
        { data: JSON.stringify({ intent: intent, entity: { 'on': (value == 'on') }})} 
      );
    } 
  }
  document.getElementById("result").innerHTML = result;
};

function sendRequest(url, data) {
  $.ajax({
    url: url,
    type: 'PUT',
    data: data,
    dataType: 'json'
  });
}

...
```

In `routes/api.js` make a route to accept a `PUT` request from the client side and send a `PUT` request to the lights.

```javascript
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

module.exports = router;
```

To get the ip address of the Hue Bridge, visit www.meethue.com/api/nupnp.

Restart your server and try it out!

## Changing the Color of the Lights

Go back to your Wit.ai instance and create a new intent called "change_color." Train it with a few phrases like "Make the lights blue" and "Change the color to green."

In `public/javascripts/scripts.js` add the following code which creates a dictionary of colors and sends the change_color intent to the server.

```javascript
var colors = {
        blue:     { hue: 43680, saturation: 255,  brightness: 127},
        cyan:     { hue: 35000, saturation: 255,  brightness: 127 },
        fuchsia:  { hue: 54612, saturation: 255,  brightness: 127 },
        green:    { hue: 26000, saturation: 255,  brightness: 63 },
        lavender: { hue: 50050, saturation: 145,  brightness: 173 },
        orange:   { hue: 6100,  saturation: 255,  brightness: 150 },
        red:      { hue: 0,     saturation: 255,  brightness: 127 },
        violet:   { hue: 50400, saturation: 255,  brightness: 127 },
        white:    { hue: 0,     saturation: 0,    brightness: 255 },
        yellow:   { hue: 14563, saturation: 255,  brightness: 150 }
    };

...

mic.onresult = function (intent, entities) {
  var result = 'WAT?!';
  if (intent == 'lights') {
    var value = entities.on_off && entities.on_off.value;
    if (value == 'on' || value == 'off') {
      result = 'Turing the lights ' + value;
      sendRequest(
        'api/lights',
        { data: JSON.stringify({ intent: intent, entity: { 'on': (value == 'on') }})} 
      );
    } 
  } else if (intent == 'change_color') {
    var value = entities.color && entities.color.value;
    var color = colors[value];
    if (color) {
      sendRequest(
        'api/change_color', 
        { data: JSON.stringify({ intent: intent, entity: { hue: color.hue, brightness: color.brightness, saturation: color.saturation }})}
      );
      result = 'Changing the lights to ' + value;
    } else {
      result = 'I don\'t know the color ' + value;
    }
  }
  document.getElementById("result").innerHTML = result;
};
...
```

Add the `/change_color` route to `routes/api.js`.

```javascript
router.put('/change_color', function(req, res) {
    var command = JSON.parse(req.body.data);
    for (var i = 0; i < lights.length; i++) {
        request.put(hue_url + lights[i].id + '/state', { json: command.entity });
    }
});
```
Restart the server and party!

## The Inbox

The last thing to do is check your Wit.ai Inbox. All of the API calls you make to Wit are found there and you can validate or correct each expression to continue training your instance. The more you reward and correct your instance, the more accurate it will become. 