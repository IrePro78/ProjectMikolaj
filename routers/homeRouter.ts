import {Request, Response, Router} from 'express';

export const homeRouter = Router();

homeRouter
  .get('/', (req: Request, res: Response): void => {
    res.redirect('/child');
  });

