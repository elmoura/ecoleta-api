import express from 'express';
import path from 'path';
import routes from './routes';
import cors from 'cors';

const app = express();
const PORT = 3333;

app.use(cors({ origin: 'localhost:3000' }));
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
});
