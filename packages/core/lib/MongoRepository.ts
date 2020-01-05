import { MongoRepository } from '@nger/typeorm-native'
import { Injector } from '@nger/core'
export class NgerMongoRepository<Entity> extends MongoRepository<Entity>{ 
    injector: Injector;
}