import express from 'express';
import userRoutes from './routes/userRoutes';
import tweetRoutes from './routes/tweetRoutes';
import authRoutes from './routes/authRoutes';
import { authenticateToken } from './middlewares/authMiddleware';


const app = express();
app.use(express.json()); //will automatically parse files as json instead of a string
app.use('/user', authenticateToken, userRoutes);
app.use('/tweet', authenticateToken, tweetRoutes);
app.use('/auth', authRoutes);
 
app.get('/', (req, res) => {
res.send('Hello world. Update check.');
});

app.listen(4000, () => {
    console.log('Server ready at localhost:4000');
});