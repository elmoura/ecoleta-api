import knex from '../database/connection';
import { Request, Response, response } from 'express';

class PointsController {
  async create(req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = req.body;

    const transaction = await knex.transaction();

    const point = {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city, 
      image: 'https://cms.qz.com/wp-content/uploads/2020/04/RTX77LBJ-e1587021603942.jpg?quality=75&strip=all&w=160&h=90&crop=1',
      uf,
    };

    const [point_id] = await transaction('points').insert(point);

    const pointItems = items.map((item_id: number) => {
      return { item_id, point_id };
    });

    await transaction('point_items').insert(pointItems);

    await transaction.commit();

    return res.json({ id: point_id, ...point });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return res.status(400).json({ error: 'Point not found.' });
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title', 'items.id');


    return res.json({ ...point, items });
  }

  async index(req: Request, res: Response) {

    const { city, uf, items } = req.query;

    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

      return res.json(points);
  }

}

export default PointsController;
