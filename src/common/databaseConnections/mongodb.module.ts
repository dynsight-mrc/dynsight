import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

const mongodbConnetion = MongooseModule.forRoot(
  'mongodb://mongo-dynsight-1:27017,mongo-dynsight-2:27017,mongo-dynsight-3:27017/dynsight?replicaSet=myReplicaSet',
);

@Global()
@Module({
  imports: [mongodbConnetion],
  exports: [mongodbConnetion],
})
export class MongodbModule {}
