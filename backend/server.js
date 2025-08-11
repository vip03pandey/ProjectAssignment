const express=require('express');
const cors=require('cors')
const dotenv=require('dotenv');
dotenv.config();
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const providerRoutes=require('./routes/providerRoutes')
const app=express();
app.use(express.json());

connectDB();
app.get("/", (req, res) => {
    res.send("Hello World!");
});

const PORT=process.env.PORT || 5000;
const allowedOrigins = [
  'http://localhost:5173', // for local dev
  'https://project-assignment-gamma.vercel.app/' 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use("/api/users", userRoutes);
app.use("/api/client",clientRoutes)
app.use('/api/provider',providerRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});