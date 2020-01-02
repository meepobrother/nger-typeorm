import { Connection, ConnectionOptions, QueryRunner, EntityManager, ObjectType, EntitySchema } from 'typeorm'
import { Injector, getCurrentInjector } from '@nger/core';
import { NgerEntityManagerFactory } from './EntityManagerFactory';
import { NgerMongoRepository } from './MongoRepository';
import { MongoDriver } from 'typeorm/driver/mongodb/MongoDriver';
import { NgerEntityManager } from './EntityManager';
export class NgerConnection extends Connection {
    readonly manager: NgerEntityManager;
    public injector: Injector;
    constructor(options: ConnectionOptions, injector: Injector) {
        super(options)
        this.injector = injector || getCurrentInjector()
    }
    getMongoRepository<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string): NgerMongoRepository<Entity> {
        if (!(this.driver instanceof MongoDriver))
            throw new Error(`You can use getMongoRepository only for MongoDB connections.`);
        return this.manager.getRepository(target) as any;
    }
    createEntityManager(queryRunner?: QueryRunner): EntityManager {
        return new NgerEntityManagerFactory().create(this, queryRunner);
    }
}