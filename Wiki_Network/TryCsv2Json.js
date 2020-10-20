    var csv = require('csv'); 
    // loads the csv module referenced above.

    var obj = csv(); 
    // gets the csv module to access the required functionality

    function MyNodesCSV(Fone, Ftwo = 1) {
        this.name = Fone.substring(11); // Delete the /index.php/ part
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

    var MyNodes = []; // Will contain a list of MyNodesCSV objects
    var MyLinks = []; // Will contain a list of MyLinksCSV objects
    var MyData = []; // Will contain ONLY ONE SET of MyNodes-MyLinks pair
    var NodeList = []; // Will contain a list of added nodes

    // Check if the Node is already added into the NodeList and return the Node index.
    // If YES, return the node index. If NO, add the new node and return the node index.
    function checkNewNode(node) {
        if (NodeList.indexOf(node) === -1) {
            MyNodes.push(new MyNodesCSV(node));
            NodeList.push(node);
        }
        return NodeList.indexOf(node);
    }

    obj.from.path('sudep_wikiconnectedness_14sep2018.csv').to.array(function (data) {
        for (var index = 2; index < data.length-1; index++) {

            var currentIndex = checkNewNode(data[index][1]); // Get Node Index

            // Check the "Pages That Link To This Page" field for each of the incoming nodes. 
            let incoming = data[index][2].split(/\r\r/);
            if (typeof incoming[0] !== undefined) {
                for (var inpage = 1; inpage < incoming.length - 1; inpage++){
                    var inIndex = checkNewNode(incoming[inpage]); // Check if the incoming node already exists
                    // Create a Link, in which incoming node's index is the source value, and current index is the target value
                    MyLinks.push(new MyLinksCSV(inIndex, currentIndex));
                }
            }

            // Check the "Pages Linked from This Page" field for each of the outgoing nodes. 
            let outgoing = data[index][3].split(/\r\r/);
            if (typeof outgoing[0] !== undefined) {
                for (var outpage = 1; outpage < outgoing.length - 1; outpage++){
                    var outIndex = checkNewNode(outgoing[outpage]);  // Check if the outgoing node already exists
                    // Create a Link, in which current index is the source value, and the outgoing node is the target value
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


    // var http = require('http');
    // //Load the http module.

    // var server = http.createServer(function (req, resp) {
    //     resp.writeHead(200, { 'content-type': 'application/json' });
    //     resp.end(JSON.stringify(MyData));
    // });
    // // Create a webserver with a request listener callback.  This will write the response header with the content type as json, and end the response by sending the MyData array in JSON format.

    // server.listen(8080);
    // // Tells the webserver to listen on port 8080(obviously this may be whatever port you want.)