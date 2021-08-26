import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppMongoService {
  constructor(@InjectConnection() private connection: Connection) {
    console.log(`AppMongoService constructor`);
    this.connection.once('open', function () {
      console.log(`db connected`);
    });
    this.connection.on('error', function () {
      console.error(`error connecting to the db`);
    });
  }
}
