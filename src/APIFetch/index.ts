import express, { Request, Response , Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env'});

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.get('/', async (_req: Request, res: Response) => {
    const response = await fetcher();
    res.json(response);
});

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
});

// fetcher
import { NeliosResponseItem } from '../types';

const fetcher = async (): Promise<NeliosResponseItem[]> => {
    const res = await fetch(
        'https://aio.server9.nelios.com',
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.NELIOS_API_KEY}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
            mode: 'cors'
        }
    );
    return  (await res.json()).data;
}
