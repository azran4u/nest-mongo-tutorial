import { ICat } from './cat.interface';

export interface CreateCatDto extends Omit<ICat, 'id'> {}
