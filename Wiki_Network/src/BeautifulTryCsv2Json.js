    var csv = require('csv'); 
    // loads the csv module referenced above.

    var obj = csv(); 
    // gets the csv module to access the required functionality

    function MyNodesCSV(Fone, Ftwo = 1) {
        this.name = Fone.substring(11);
        this.group = Ftwo;
    }; 
    function MyLinksCSV(Fone, Ftwo, Fthree = 1) {
        this.source = Fone;
        this.target = Ftwo;
        this.value = Fthree;
    }; 
    function MyDataCSV(Fone, Ftwo) {
        this.nodes = Fone;
        this.links = Ftwo;
    }; 
    // Define the MyCSV object with parameterized constructor, this will be used for storing the data read from the csv into an array of MyCSV. You will need to define each field as shown above.

    var MyNodes = [];
    var MyLinks = [];
    var MyData = [];
    var NodeList = [];
    // MyData array will contain the data from the CSV file and it will be sent to the clients request over HTTP. 

    function checkNewNode(node) {
        if (NodeList.indexOf(node) === -1) {
            MyNodes.push(new MyNodesCSV(node));
            NodeList.push(node);
        }
        // else {console.log("11111111111111");}
        return NodeList.indexOf(node);
    }

    obj.from.path('sudep_wikiconnectedness_14sep2018.csv').to.array(function (data) {
        for (var index = 2; index < data.length-1; index++) {
            // if (NodeList.indexOf(data[index][1]) === -1) {
            //     MyNodes.push(new MyNodesCSV(data[index][1]));
            //     NodeList.push(data[index][1]);
            // } else {console.log("11111111111111");}
            // var currentIndex = NodeList.indexOf(data[index][1]);
            var currentIndex = checkNewNode(data[index][1]);

            let incoming = data[index][2].split(/\r\r/);
            if (typeof incoming[0] !== undefined) {
                for (var inpage = 1; inpage < incoming.length - 1; inpage++){
                    // if (NodeList.indexOf(incoming[inpage]) === -1) {
                    //     MyNodes.push(new MyNodesCSV(incoming[inpage]));
                    //     NodeList.push(incoming[inpage]);
                    // } else {console.log("2222222222222222");}
                    // var inIndex = NodeList.indexOf(incoming[inpage]);
                    var inIndex = checkNewNode(incoming[inpage]);
                    MyLinks.push(new MyLinksCSV(inIndex, currentIndex));
                }
            }

            let outgoing = data[index][3].split(/\r\r/);
            if (typeof outgoing[0] !== undefined) {
                for (var outpage = 1; outpage < outgoing.length - 1; outpage++){
                    // if (NodeList.indexOf(outgoing[outpage]) === -1) {
                    //     MyNodes.push(new MyNodesCSV(outgoing[outpage]));
                    //     NodeList.push(outgoing[outpage]);
                    // } else {console.log("3333333333333333");}
                    // var outIndex = NodeList.indexOf(outgoing[outpage]);
                    var outIndex = checkNewNode(outgoing[outpage]);
                    MyLinks.push(new MyLinksCSV(currentIndex, outIndex));
                }
            }
        }
        MyData.push(new MyDataCSV(MyNodes, MyLinks));
        data = JSON.stringify(MyData);
        // console.log('var data = ' + data);
        // var fs = require('fs');
        // fs.writeFile("BeautifulData.json", 'var data = ' + data, function(err) {
        //     if (err) {
        //         console.log(err);
        //     }
        // });
    });

    // //Reads the CSV file from the path you specify, and the data is stored in the array we specified using callback function.  This function iterates through an array and each line from the CSV file will be pushed as a record to another array called MyData , and logs the data into the console to ensure it worked.

    // var http = require('http');
    // //Load the http module.

    // var server = http.createServer(function (req, resp) {
    //     resp.writeHead(200, { 'content-type': 'application/json' });
    //     resp.end(JSON.stringify(MyData));
    // });
    // // Create a webserver with a request listener callback.  This will write the response header with the content type as json, and end the response by sending the MyData array in JSON format.

    // server.listen(8080);
    // // Tells the webserver to listen on port 8080(obviously this may be whatever port you want.)