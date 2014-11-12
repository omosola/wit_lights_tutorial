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
	    console.log(intent, entities);
	    var result = concatKeyValue("intent", intent);

	    for (var k in entities) {
		var e = entities[k];

		if (!(e instanceof Array)) {
		    result += concatKeyValue(k, e.value);
		} else {
		    for (var i = 0; i < e.length; i++) {
			result += concatKeyValue(k, e[i].value);
		    }
		}

		document.getElementById("result").innerHTML = result;
	    }
	};

	mic.connect("EPTSOEDCDJ4VIJDIFNDUBJRZZNIWUJQU");

	function concatKeyValue (k, v) {
	    if (typeof v !== "string") {
		v = JSON.stringify(v);
	    }
	    return k + "=" + v + "\n";
	}
    });