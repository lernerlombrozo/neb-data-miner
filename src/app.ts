import express, {Request, Response, NextFunction} from 'express';
import { json } from 'body-parser';

import todoRoutes from './routes/todos';
import enzymesRoutes from './routes/enzymes';

import { getEnzymesHTML } from './neb-data-miner';

getEnzymesHTML();

const app = express();

app.use(json());

app.use('/todos', todoRoutes);
app.use('/enzymes', enzymesRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction)=>{
    res.status(500).json({message: err.message});
})

app.listen(3000);

