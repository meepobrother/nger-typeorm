import { TreeRepository } from 'typeorm'
import { Injector } from '@nger/core'
export class NgerTreeRepository<Entity> extends TreeRepository<Entity> { 
    injector: Injector;
}