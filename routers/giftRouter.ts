import {Request, Response, Router} from 'express';
import { GiftRecord } from'../records/gift.record';


export const giftRouter = Router();

giftRouter
  .get('/', async (req: Request, res:Response): Promise<void> => {
    const giftsList = await GiftRecord.listAll();
    res.render('gift/list', {giftsList} );
  })

  .post('/', async (req: Request, res:Response): Promise<void> => {
    const data = {
      ...req.body,
      count: Number(req.body.count)
    };
    await new GiftRecord(data).add();
    res.redirect('/gift');
  });
