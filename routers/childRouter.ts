import {Request, Response, Router} from 'express';
import { ChildRecord } from '../records/child.record';
import { GiftRecord } from '../records/gift.record';
import { ValidationError } from '../utils/errors';

export const childRouter = Router();

childRouter
  .get('/', async (req: Request, res:Response): Promise<void> => {
    const childrenList = await ChildRecord.listAll();
    const giftsList = await GiftRecord.listAll();
    res.render('children/list', {
      childrenList,
      giftsList
    });
  })

  .post('/', async (req: Request, res:Response): Promise<void> => {
    await new ChildRecord(req.body).add();
    res.redirect('/child');

  })
  .patch('/gift/:childId', async (req: Request, res:Response): Promise<void> => {
    const child = await ChildRecord.getOne(req.params.childId);

    if (child === null) {
      throw new ValidationError('Nie ma dziecka z takim ID');
    }

    const gift = req.body.giftId === '' ? null : await GiftRecord.getOne(req.body.giftId);

    if (gift) {
      if (gift.count <= await gift.countGifts()) {
        throw new ValidationError('Tego prezentu już nie ma');
      }
    }

    child.giftId = gift?.id ?? null;
    await child.update();

    res.redirect('/child');

  });

