import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import express, { Express, NextFunction, Request, Response } from 'express';

import healthcheck from './routes/healthcheck';

const app: Express = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cors());
app.use(helmet());

app.use('/healthcheck', healthcheck);

app.use((req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({ message: 'Not found' });
});

const httpServer = http.createServer(app);
const port: number = parseInt(process.env.PORT ?? '3000', 10);
httpServer.listen(port, () => console.log(`The server is running on port ${port}`));