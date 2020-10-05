const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const apiKey = "4e575acbc797c4f405f288d328c5803a-us2";
const listID = "de210387b4";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/static'));

// Signup page
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.post('/', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const emailAddress = req.body.emailAddress;
    const data = {
        members: [
            {
                email_address: emailAddress,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]

    };
    const url = "https://us2.api.mailchimp.com/3.0/lists/" + listID;
    const options = {
        method: "POST",
        auth: "fbauer:" + apiKey
    }

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname+"/public/success.html")
        } else {
            res.sendFile(__dirname+"/public/failure.html")
        }

        response.on('data', result => {
            console.log(JSON.parse(result));
        })
    });

    request.write(JSON.stringify(data));
    request.end();
});


// Redirect from failure page
app.post('/failure', (req,res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || port, () => {
    console.log('Server has started at port ', port);
});