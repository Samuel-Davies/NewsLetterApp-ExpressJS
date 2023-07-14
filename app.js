const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const https = require('https');

const app = express();

// middleware 

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.listen(3000, ()=>{
    console.log("Running server on port 3000");
});

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/signup.html')
});

app.post('/', (req, res)=>{
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {
        members : [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const  jsonData = JSON.stringify(data);

    const url = "https://us12.api.mailchimp.com/3.0/lists/c2893a38da"; 

    const options = {
        method: 'POST', 
        auth: 'yours:bec6589dfa747a3d7b227b7cf0790e49-us12'
        
    }

    const request = https.request(url, options, (response)=>{
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on('data', (data)=>{
            console.log(JSON.parse(data));
        });
    });
 
    request.write(jsonData);
    request.end();

    // sucess or failure response 

   

});

app.post('/failure', (req, res)=>{
    res.redirect('/');
});


