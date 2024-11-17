const express = require('express');
const MongoClient = require('mongodb').MongoClient;

//const bodyParser = require('body-parser')

const app = express();

app.use(express.json());
app.set('port', 3000);
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    next();
})


let db;

MongoClient.connect('mongodb+srv://parvathim2004:1234@cluster0.acnmseg.mongodb.net/', (err, client)=>{
    db = client.db('CST3144_M00909333');
});

app.get('/',(req,res,next)=>{
    res.send('Select a collection, e.g., /collection/messages');
});

app.param('collectionName', (req, res, next, collectionName) => { 
     req.collection = db.collection(collectionName) 
     return next() 
 });


 app.get('/collection/:collectionName', (req, res, next) => { 
    req.collection.find({}).toArray((e, results) => { 
    if (e) return next(e) 
        res.send(results) 
        }) 
    })  

    app.post('/collection/:collectionName', (req, res, next) => { 
        req.collection.insert(req.body, (e, results) => { 
        if (e) return next(e) 
        res.send(results.ops)
         }) 
        }) 
        
app.listen(3000,()=>{
    console.log('server.js server running at localhost:3000')
})