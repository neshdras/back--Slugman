const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
require('dotenv').config()
const { sequelize, connectDB } = require('./config/database')
const startServer = async () => {
    await connectDB()
    await sequelize.sync({alter: false})
    console.log('Table sync')
}
startServer()
// app.use(
//     helmet({
//         contentSecurityPolicy: false,
//         crossOriginRessoucePolicy: { policy: "cross-origin" }
//     })
// )
const authRoutes = require('./routes/authRoute')
const storyRoutes = require('./routes/storyRoute')
// const tournamentRoutes = require('./routes/tournamentRoute')
// const adminRoutes = require('./routes/adminRoute')
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 15*60*1000, // femetre de 15min,
    limit: 100, // Max 100 requete par créneau
    message: { status: 429, error: 'Trop de requete, réessayez plus tard'}
})

app.use(limiter)
app.use(express.json())

const allowedOrigins = [
    'https://front-slugman.vercel.app',
    'http://localhost:5173'
];

// 2. Middleware CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, origin); // Renvoie l'origine sans faire crasher l'app
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || 'https://front-slugman.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});


app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/story', storyRoutes)

app.get('/', (req, res) => {
    res.send('Bienvenue sur mon api rest')
})
app.listen(port, ()=>{
    console.log(`Serveur start on http://localhost:${port}`)
})

