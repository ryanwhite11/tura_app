var Readable = require('stream').Readable  
var util = require('util')  
var five = require('johnny-five')  
var fahrenheit = document.querySelector('#fahrenheit')
var celsius = document.querySelector('#celsius')
var light = document.querySelector('#light')

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
		var temperatureC = (voltage - 0.5) * 10;
		var temperatureC = temperatureC.toFixed(0);
		//console.log("Celsius - " + temperatureC.toFixed(0));
		celsius.innerHTML = temperatureC + "ºC";

		var temperatureF = (temperatureC * 9.0 / 5.0) + 32.0;
		var temperatureF = temperatureF.toFixed(0);
		fahrenheit.innerHTML = temperatureF + "ºF";
		//console.log("Farenheit - " + temperatureF.toFixed(0));
	});


});