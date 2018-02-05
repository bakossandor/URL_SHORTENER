const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express();
const port = process.env.PORT || 3000;
const mongourl = process.env.MONGOLAB_URI || process.env.MONGODB_URI;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(mongourl, (error, success) => {

    if(error) {
        console.log(error);
    } else {
        console.log("successfully connected to db");
    }

});

//setting the database schema and model/collection
var urlSchema = mongoose.Schema({
    requestedUrl: String,
    shortVersionOfUrl: Number
});

var UrlCopy = mongoose.model("urlCopy", urlSchema, "urlcopies");

//handling the requests

app.get("/", (req, res) => {

    res.send("type after the existin url a new\/ - the requested shortened url - ");

});

app.get("/:url", (req, res) => {

    urlParam = req.params.url;
    
    // if the req is the shortnumber the server find if it is valid and redirect to the requested page
    if (!isNaN(urlParam)) {
        
        UrlCopy.find({shortVersionOfUrl: urlParam}, (err, data) => {

            if (err) {
                res.send("not a valid url request");
            } else {

                // res.json(data);
                res.redirect(`http://${data[0].requestedUrl}`);

            }
            
        })
    } 
    // if the req is the stored web adress give redirect to there
    else {

        UrlCopy.find({requestedUrl: urlParam}, (err, data) => {

            if (err) {
                res.send("not a valid url request");
            } else {
                res.redirect(`http://${data[0].requestedUrl}`);
                // res.json(data);
            }

        })
    }

});

app.get("/new/:url", (req, res) => {
    //need to validate the url
    var regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    var requestedSite = req.params.url

    if (!regex.test(requestedSite)) {
        res.send("not walid e-mail adress");
    } else {

        var randomNumber = Math.floor(Math.random()*10000);
        console.log(randomNumber);

        UrlCopy.create({requestedUrl: requestedSite, shortVersionOfUrl: randomNumber}, (err, data) => {

            (err) => {
                console.log(err);
            }
           
            // ,

            UrlCopy.find({requestedUrl: requestedSite}, "requestedUrl shortVersionOfUrl -_id", (error, databack) => {

                if (error) {
                    res.json(error);
                } else {
                    res.json(databack[0]);
                }

            });

        });
        
    }
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})