import {ValidationError} from '../utils/errors';
import {pool} from '../utils/db';
import {v4 as uuid} from 'uuid';
import {FieldPacket} from "mysql2";


type ChildRecordResults = [ChildRecord[], FieldPacket[]];


export class ChildRecord {

  id?: string;
  name: string;
  giftId: string;

  constructor(obj: ChildRecord) {
    if (!obj || obj.name.length < 3 || obj.name.length > 55) {
      throw new ValidationError('Zbyt długa lub krótka nazwa');
    }
    this.id = obj.id;
    this.name = obj.name;
    this.giftId = obj.giftId;
  }

  static async listAll(): Promise<ChildRecord[]> {
    const [results] = await pool.execute('SELECT * FROM `children` ORDER BY `name` ASC') as ChildRecordResults;
    return results.map((obj) => new ChildRecord(obj));
  }

  static async getOne(id: string): Promise<ChildRecord | null> {
    const [results] = await pool.execute('SELECT * FROM `children` WHERE `id` = :id', {
      id,
    }) as ChildRecordResults;
    return results.length === 0 ? null : new ChildRecord(results[0]);
  }

  async add(): Promise<string> {
    if (!this.id) {
      this.id = uuid();
    }
    await pool.execute('INSERT INTO `children` (`id`, `name`) Values(:id, :name)', {
      id: this.id,
      name: this.name,
    });
    return this.id;
  }
  async update(): Promise<void> {
    await pool.execute('UPDATE `children` SET `name` = :name, `giftId` = :giftId WHERE `id` = :id', {
      id: this.id,
      name: this.name,
      giftId: this.giftId,
    });
  }

}
