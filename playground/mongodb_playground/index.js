import connect from './mongoConnect';

connect("mongodb://localhost:27017/test")
.then(
    (db)=>{
        db
        .collection("test")
        .insertOne(
            {
                name: 'testname',
                age: 18
            },
            (err, res)=>{
                if (err) throw err;
                console.log("one record inserted");
                db.close();
            }
        )
    }
)
.catch((err)=>{
    console.log(err);
})
