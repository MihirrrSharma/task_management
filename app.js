const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const taskRoutes = require('./routes/taskRoutes');
const subtaskRoutes = require('./routes/subtaskRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

app.use(bodyParser.json());
app.use('/api', taskRoutes);
app.use('/api', subtaskRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
