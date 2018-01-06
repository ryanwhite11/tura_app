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
process.__defineGetter__('stdin', function() {  
  if (process.__stdin) return process.__stdin
  process.__stdin = new MyStream()
  return process.__stdin
})

var board = new five.Board();

board.on("ready", function fireGraphs(){
	
	var waterSensor = new five.Sensor({
		pin: "A2",
		freq: 250, 
		threshold: 50 
	});

	waterSensor.on("change", function(){
		var status;
		var instruction;
		var moisture = this.value;
		var moisturePercent = (1023-moisture);
		var moistureStatus = document.querySelector("#waterData h3");
		var moistureInstruction = document.querySelector("#waterData .message");
		var waterLevel = document.querySelector("#waterData .level span");

		moisturePercent = (moisturePercent/600)*100;
		if(moisturePercent>=100) {
			moisturePercent = 100;
			status="High";
			instruction = "Too much water.";
		}else if(moisturePercent>70){
			status="High";
			instruction = "Too much water.";
		}else if(moisturePercent>50){
			status="Great";
			instruction = "No water needed.";
		}
		else if(moisturePercent>30){
			status="Good";
			instruction = "No water needed.";
		}else if(moisturePercent>20){
			status="Okay";
			instruction = "Needs water.";
		}else if(moisturePercent>5){
			status="Low";
			instruction = "Needs water.";
		}else{
			status="Caution";
			instruction = "Desperately needs water.";
		}

		var rp3 = radialProgress(document.querySelector('.graphDiv1'))
            .diameter(200)
            .value(moisturePercent)
            .render();

        var rpMobile = radialProgress(document.querySelector('.mobileGraph'))
            .diameter(200)
            .value(moisturePercent)
            .render();

        moistureStatus.innerHTML=status;
        moistureInstruction.innerHTML=instruction;
        waterLevel.innerHTML=moisturePercent.toFixed(0);

	});

	var lightSensor = new five.Sensor({
		pin: "A0",
		freq: 250, 
		threshold: 10

	});


	lightSensor.on("change", function(){
		var lux = this.value;
		var lightStatus = document.querySelector("#lightData h3");
		var lightInstruction = document.querySelector("#lightData .message");
		var lightLevel = document.querySelector("#lightData .level span");
		var status;
		var instruction;

		if (lux < 300) {
			status = "Dark";
			instruction = "Move plant in to the light.";
		  } else if (lux < 600) {
		    status = "Dim";
		    instruction = "Move plant in to the light.";
		  } else if (lux < 800) {
		    status = "Light";
		    instruction = "Okay amount of light.";
		  } else if (lux < 900) {
		    status = "Bright";
		    instruction = "Good amount of light.";
		  } else {
		   	status = "Very Bright";
		   	instruction = "Great amount of light.";
		  }

		  var luxPercent = ((lux / 1000) * 100);
		  var rp1 = radialProgress(document.querySelector('.graphDiv2'))

	            .diameter(200)
	            .value(luxPercent)
	            .render();

        lightStatus.innerHTML=status;
        lightInstruction.innerHTML=instruction;
        lightLevel.innerHTML=lux;



	});

	var tempSensor = new five.Sensor({
		pin: "A1",
		freq: 500, 
		threshold: 2 

	});


	tempSensor.on("change", function(){
		var voltage = this.value * 5;
		var voltage = voltage/=1024;
		var tempStatus = document.querySelector("#tempData h3");
		var tempInstruction = document.querySelector("#tempData .message");
		var tempLevel = document.querySelector("#tempData .level span");
		var status;
		var instruction;

		//Celsius
		temperatureC = (voltage - 0.5) * 10;
		temperatureC = temperatureC.toFixed(0);

		//Farenheit
		temperatureF = (temperatureC * 9.0 / 5.0) + 32.0;
		temperatureF = temperatureF.toFixed(0);

		if (temperatureC > 28) {
			status = "High";
			instruction = "Lower temperature.";
		  } else if (temperatureC > 20) {
		    status = "Great";
		    instruction = "Perfect temperature.";
		  } else if (temperatureC > 15) {
		    status = "Good";
		    instruction = "Raise temperature slightly.";
		  } else if (temperatureC > 10) {
		    status = "Okay";
		    instruction = "Raise temperature.";
		  } else {
		   	status = "Low";
		   	instruction = "Raise temperature quickly.";
		  }
	
		var tempPercent = ((temperatureC / 25) * 100);
		var rp2 = radialProgress(document.querySelector('.graphDiv3'))
	            .diameter(200)
	            .value(tempPercent)
	            .render();

	   	tempStatus.innerHTML=status;
	   	tempInstruction.innerHTML=instruction;
	    tempLevel.innerHTML=temperatureC;
	});

	function switchData(e){
		for (var i = 0; i <buttons.length; i++) {
			buttons[i].classList.remove('active');
		}
		var target = e.currentTarget.id.slice(10,11);
		e.currentTarget.className="active";
		var divs = document.querySelectorAll('.dataCon');
		for (var i = 0; i <divs.length; i++) {
			divs[i].classList.remove('d-block');
			divs[i].classList.add('d-none');
		}
		divs[target].classList.add('d-block');
	}

	for (var i = 0; i <buttons.length; i++) {
		buttons[i].addEventListener("click", switchData, false);
	}


});


