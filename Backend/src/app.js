const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path')
const cors = require('cors');

const app = express();


// app.use(cors({
//   credentials: true,
//   origin : 'http://localhost:5173'
// }));

app.use(cors({
  credentials: true,
  origin: [
    'http://localhost:5173',
    process.env.Frontend_URL
  ]
}));

// app.use(cors({
//   credentials: true,
//   origin: process.env.NODE_ENV === 'production'
//     ? process.env.CLIENT_URL        
//     : 'http://localhost:5173'
// }));

app.use(express.json());
app.use(cookieParser());

const userRoute = require('./route/user.route');
let imageRoute = require('./route/image.route');
let groupRoute = require('./route/group.route');
let inviteRoute = require('./route/invite.route');
let expenseeRoute = require('./route/expense.route');
let balanceRoute = require('./route/balance.router');
let settlementRoute = require('./route/settlement.route');
let profileRoute = require('./route/profile.route');

app.use('/api/user', userRoute);
app.use('/api/image', imageRoute);
app.use('/api/group', groupRoute);
app.use('/api', inviteRoute);
app.use('/api/expense', expenseeRoute);
app.use('/api/balance', balanceRoute);
app.use('/api/settlement', settlementRoute);
app.use('/api/profile', profileRoute);

// app.use(express.static(path.join(__dirname, "..", "public", "dist")));

// app.use((req, res) => {
//     res.sendFile(
//         path.join(__dirname, "..", "public", "dist", "index.html")
//     );
// });
module.exports = app;