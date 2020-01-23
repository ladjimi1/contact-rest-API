const express = require('express')
const {MongoClient, ObjectID} = require ('mongodb')
const app = express()
app.use(express.json())

const mongo_url='mongodb://localhost:27017'
const dbName="contactsApi"
MongoClient.connect(mongo_url,{useUnifiedTopology:true},(err,client)=>{
    if(err){
        console.log('data base no connected');
    }else{
        const db=client.db(dbName);
        app.post("/addcontact",(req,res)=>{
            const newContact = req.body;
            db.collection("contacts").insertOne(newContact,(err,data)=>{
           if (err) res.send(err);
           res.send(data);
            });
            
        });


        app.get('/get_contact' ,(req , res)=>{
            db.collection('contacts').find().toArray((err,data)=>{
                if(err)
                res.send('cant fetch array')
                else
                res.send(data)
            })
        })
        app.put('/modify_contact/:id',(req,res)=>{
            let id =ObjectID(req.params.id)
            let modifiedContact =req.body
            db.collection('contacts').findOneAndUpdate({_id : id}, 
            {$set: {...modifiedContact}},(err , data)=>{
                if(err) res.send('cant modify contact')
                else res.send('contact modified')
            })
        })
        app.delete('/delete_contact/:id', (req,res)=>{
            let contactToRemoveId =ObjectID(req.params.id)
            db.collection('contacts').findOneAndDelete({_id : contactToRemoveId},(err,data)=>{
                if(err) res.json('cant delete contact')
                else res.json('contact deleted')
            })

        })
    
       

    }
    
});


app.listen(5000,(err)=>{
    if(err)
    console.log("server error")
    else
    console.log("server inrunnig on port 5000")
})
