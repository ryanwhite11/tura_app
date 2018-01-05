// console.log("WORKING");
function radialProgress(parent) {
    var data=null,
        duration= 1000,
        margin = {top:0, right:0, bottom:30, left:0},
        label="";

    var minValue = 0,
        maxValue = 100;

    var currentArc = 0, 
        currentValue = 0;

    var arc = d3.svg.arc().startAngle(0 * (Math.PI/180)); 

    selection=d3.select(parent);

    function component() {

        selection.each(function (data) {

            var svg = d3.select(this).selectAll("svg").data([data]);
            var enter = svg.enter().append("svg").attr("class","radial-svg").append("g");

            measure();

            svg.attr("width", width)
               .attr("height", height);

            // Light Grey Background Arcs 
            var background = enter.append("g").attr("class","component");
            arc.endAngle(360 * (Math.PI/180))
            background.append("path")
                .attr("transform", "translate(" + width/2 + "," + width/2 + ")")
                .attr("d", arc);

            //Coloured Arcs
            enter.append("g").attr("class", "arcs");
            var path = svg.select(".arcs").selectAll(".arc").data(data);
            path.enter().append("path")
                .attr("class","arc")
                .attr("transform", "translate(" + width/2 + "," + width/2 + ")")

            // labels

            enter.append("g").attr("class", "labels");
            var label = svg.select(".labels").selectAll(".label").data(data);
            label.enter().append("text")
                 .attr("class","label")
                 .attr("y",width/2+ fontSize/3)
                 .attr("x",width/2)
                 .style("font-size",fontSize+"px");

            layout(svg);

            function layout(svg) {

                var ratio=(value-minValue)/(maxValue-minValue);
                var endAngle = Math.min(360*ratio,360) * Math.PI/180;

                //Increases the Arc
                path.datum(endAngle); // stops te arc at the endAngle Value
                path.transition().duration(duration).attrTween("d", arcTween);

                //Increase Label Value
                label.datum(Math.round(ratio*100)); //sets the value of 100%
                label.transition().duration(duration).tween("text",labelTween);
            }
        });
    }

    // Label Function

    function labelTween(a) {
        var i = d3.interpolate(currentValue, a);
        currentValue = i(0);

        return function(t) {
            currentValue = i(t);
            this.textContent = Math.round(i(t)) + "%"; ///contatinate a unit here to add on the end of the label
            //create a function that will populate this with the proper unit (%, degrees, lux)
        }
    }

    // Arc Function

    function arcTween(a) {
        var i = d3.interpolate(currentArc, a);
        return function(t) {
            //returns the coloured arc
            return arc.endAngle(i(t))();
        };
    }

    function measure() {
        // Set Width, Height
        width=diameter - margin.right - margin.left - margin.top - margin.bottom;
        height=width;
        // sets font size of lable
        fontSize=width*.2;
        // width of the arcs
        arc.outerRadius(width/2);
        arc.innerRadius(width/2 * .85);
    }

    //renders chart
    component.render = function() {
        measure();
        component();
        return component;
    }


    //Gets and sends value
    component.value = function (x) {
        value = x;
        selection.datum([value]);
        return component;
    }

    //Gets and sends diamiter value

    component.diameter = function(x) {
        diameter = x;
        return component;
    };

    return component;
}
