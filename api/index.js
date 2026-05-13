const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// A simple test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AlgoScope Backend is running!' })
})

module.exports = app
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`)
// })
