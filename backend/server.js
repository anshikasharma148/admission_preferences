const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/student');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/student', studentRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
