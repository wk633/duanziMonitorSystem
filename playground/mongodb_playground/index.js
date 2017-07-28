import connect from './mongoConnect';

connect("mongodb://localhost:27017/test")
.then(
    async (db)=>{
        const collection = db.collection('test');
        const res = await collection.insertOne({name: "test", age: 19});
        const result = await collection.find({}).toArray();
        console.log(result);        
        db.close();
    },
    (err)=>{
        console.log("db connection error")
        throw err;
    }
)

.catch((err)=>{
    console.log(err);
    dbConnect.close();
})
