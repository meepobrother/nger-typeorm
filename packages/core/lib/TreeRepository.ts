import { TreeRepository } from './typeorm-native'
import { Injector } from '@nger/core'
export class NgerTreeRepository<Entity> extends TreeRepository<Entity> { 
    injector: Injector;
}