let Redis=require('ioredis')

let redis=new Redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD,
})

redis.on("connect",()=>{
    console.log("Redis Is Connected successfully")
})
redis.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports=redis;