var Readable = require('stream').Readable  
var util = require('util')  
var five = require('johnny-five')  
var fahrenheit = document.querySelector('#fahrenheit')
var celsius = document.querySelector('#celsius')
var light = document.querySelector('#light')
var temperatureC;
var temperatureF;
var lux;

util.inherits(MyStream, Readable)  
function MyStream(opt) {  
  Readable.call(this, opt)
}

MyStream.prototype._read = function() {};  
// hook in our stream
process.__defineGetter__('stdin', function() {  
  if (process.__stdin) return process.__stdin
  process.__stdin = new MyStream()
  return process.__stdin
})

var board = new five.Board();

board.on("ready", function(){
	console.log("CONNECTED");
	
	var lightSensor = new five.Sensor({
		pin: "A0",
		freq: 250, //Emits the data event every 250 milliseconds
		threshold: 10 //Emits change event when value has changed by +2 or -2
	});


	lightSensor.on("change", function(){
		console.log("Light = " + this.value);
		var lux = this.value;
		var status;
		if (light < 100) {
			status = "Dark";
		    console.log(status);
		  } else if (lux < 400) {
		    status = "Dim";
		    console.log(status);
		  } else if (lux < 700) {
		    status = "Light";
		    console.log(status);
		  } else if (lux < 800) {
		    status = "Bright";
		    console.log(status);
		  } else {
		   	status = "Very Bright";
		    console.log(status);
		  }

		  var luxPercent = ((lux / 1000) * 100);
		  var rp1 = radialProgress(document.getElementById('div1'))
	            .diameter(200)
	            .value(luxPercent)
	            .render();

		light.innerHTML = lux + "lux | " + status;


	});

	var tempSensor = new five.Sensor({
		pin: "A1",
		freq: 500, //Emits the data event every 250 milliseconds
		threshold: 2 //Emits change event when value has changed by +2 or -2
	});


	tempSensor.on("change", function(){
		//console.log("Temperature = " + this.value);
		var voltage = this.value * 5;
		var voltage = voltage/=1024;
		temperatureC = (voltage - 0.5) * 10;
		temperatureC = temperatureC.toFixed(0);
		//console.log("Celsius - " + temperatureC.toFixed(0));
		celsius.innerHTML = temperatureC + "ºC";

		temperatureF = (temperatureC * 9.0 / 5.0) + 32.0;
		temperatureF = temperatureF.toFixed(0);
		fahrenheit.innerHTML = temperatureF + "ºF";
		//console.log("Farenheit - " + temperatureF.toFixed(0));

		// tempPercent = console.log((temperatureC/25)*100);
		var tempPercent = ((temperatureC / 25) * 100);
		// console.log(parseInt(tempPercent));
		var rp2 = radialProgress(document.getElementById('div2'))
	            .diameter(200)
	            .value(tempPercent)
	            .render();
	});

	

});


