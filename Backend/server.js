require('dotenv').config();
let app=require('./src/app');
let ConnectToDB=require('./src/config/db.connection');


ConnectToDB();


app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})


