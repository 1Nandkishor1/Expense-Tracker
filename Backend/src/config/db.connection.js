
let mongoose=require('mongoose');

let ConnectToDB=()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log('Connected To Database');
    })
}

module.exports=ConnectToDB;