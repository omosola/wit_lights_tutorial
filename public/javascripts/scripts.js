$(document).ready(function () {
    var mic = new Wit.Microphone(document.getElementById("microphone"));
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

    mic.connect("Q2GO7ZL6AZHUJ3ZIR2LGTVOJGSOQHS5L");
    // mic.start();
    // mic.stop();
    
    function sendRequest(url, data) {
      $.ajax({
        url: url,
        type: 'PUT',
        data: data,
        dataType: 'json'
      });
    }

    function kv (k, v) {
      if (toString.call(v) !== "[object String]") {
        v = JSON.stringify(v);
      }
      return k + "=" + v + "\n";
    }

});   
