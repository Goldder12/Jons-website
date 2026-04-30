import express from 'express';
import cors from 'cors';
import authRoute from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import listeningTaskRoutes from './routes/listeningTaskRoutes.js';
import parseListeningRoutes from './routes/parseListeningRoutes.js';
import parseTestRoutes from './routes/parseTestRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.json({ message: 'API is running!' });
});

app.use('/api/auth', authRoute);
app.use('/api/books', bookRoutes);
app.use('/api/listening-tasks', listeningTaskRoutes);
app.use('/api/parse-listening', parseListeningRoutes);
app.use('/api/parse-test', parseTestRoutes);
app.use('/api/videos', videoRoutes);

app.use((error, req, res, next) => {
    if (!error) {
        next();
        return;
    }

    res.status(400).json({ message: error.message || 'Request failed!' });
});

export default app;
