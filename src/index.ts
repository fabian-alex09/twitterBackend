import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();
app.use(express.json()); //will automatically parse files as json instead of a string
app.use('/user', userRoutes);

app.get('/', (req, res) => {
res.send('Hello world. Update check.');
});

app.listen(4000, () => {
    console.log('Server ready at localhost:4000');
});