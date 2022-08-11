const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
// To make static css and photos display in the browser
// this function is used
app.use(express.static("public"));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    
    // Setting a new JS Object [the Data is gonna be send via the body-parameters using a key called data]
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us8.api.mailchimp.com/3.0/lists/3617218b23";
   
    const options = {
        method: "POST",
        auth: "Hrx_:153d9cabec4683e15892f501a3dccaa1-us8" 
    }

    const request = https.request(url, options, function(response){
        
        if(response.statusCode == 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });
    request.write(jsonData);
    request.end();

});

// Failure route Post request
app.post("/failure", function(req, res){
    res.redirect("/");
})

// This is a dynamic port that heroku will define 
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000.");
});

