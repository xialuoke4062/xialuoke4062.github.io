window.onload = function() {

    // function getAsText(fileToRead) {
    //     let reader = new FileReader();

    //     reader.readAsText(fileToRead);

    //     reader.onload = loadHandler;
    //     reader.onerror = errorHandler;
    // }

    // function loadHandler(event) {
    //     let csv = event.target.result;
    //     processData(csv);
    // }

    // function errorHandler (evt) {
    //     if (evt.target.error.name == "NotReadableError") {
    //         alert('Cannot read file!');
    //     }
    // }

    // function processData(csv) {
    //     let allTextLines = csv.split(/\r\n|\n/);

    //     for (let i = 0; i < allTextLines.length; i++) {
    //         let row = allTextLines[i].split(';')

    //         let col = [];

    //         for (let j = 0; j < row.length; j++) {
    //             col.push(row[j]);
    //         }

    //         console.log(col);
    //     }
    // }
    // getAsText("sudep_wikiconnectedness_14sep2018.csv");










    var width = 1500,
        height = 1500;

//Set up the colour scale
    var color = d3.scale.category20();

//Set up the force layout
    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(30)
        .size([width, height]);

//Append a SVG to the body of the html page. Assign this SVG as an object to svg
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

//Read the data from the mis element
    var mis_1 = JSON.stringify(data[0]);
    // var mis_1 = JSON.stringify(MyData);
    // console.log(data[0]);
    // var mis = document.getElementById('mis').innerHTML;
    graph = JSON.parse(mis_1);
    console.log(graph.nodes)
    console.log(graph.links)
//Creates the graph data structure out of the json data
    force.nodes(graph.nodes)
        .links(graph.links)
        .start();

//Create all the line svgs but without locations yet
    var link = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link")
        .style("marker-end", "url(#suit)") //Added
        .style("stroke-width", function (d) {
            return Math.sqrt(d.value);
        });

//Do the same with the circles for the nodes - no
    var node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 8)
        .style("fill", function (d) {
            return color(d.group);
        })
        .call(force.drag);


//Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
    force.on("tick", function () {
        link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node.attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
                return d.y;
            });
    });

    //---Insert-------
    svg.append("defs").selectAll("marker")
        .data(["suit", "licensing", "resolved"])
        .enter().append("marker")
        .attr("id", function (d) {
            return d;
        })
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 25)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
        .style("stroke", "#4679BD")
        .style("opacity", "0.6");
    //---End Insert---

    var optArray = [];
    for (var i = 0; i < graph.nodes.length - 1; i++) {
        optArray.push(graph.nodes[i].name);
    }

    optArray = optArray.sort();

    $(function () {
        $("#search").autocomplete({
            source: optArray
        });
    });

    window.searchNode = function() {

        //find the node

        var selectedVal = document.getElementById('search').value;
        var node = svg.selectAll(".node");

        if (selectedVal === "none") {
            node.style("stroke", "white").style("stroke-width", "1");
        } else {
            var selected = node.filter(function (d, i) {
                return d.name !== selectedVal;
            });
            selected.style("opacity", "0");
            var link = svg.selectAll(".link")
            link.style("opacity", "0");
            d3.selectAll(".node, .link").transition()
                .duration(5000)
                .style("opacity", 1);


        }
    }
};
