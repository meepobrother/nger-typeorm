import { Connection, ConnectionOptions, QueryRunner, EntityManager, ObjectType, EntitySchema } from 'typeorm'
import { Injector } from '@nger/core';
import { NgerEntityManagerFactory } from './EntityManagerFactory';
import { NgerMongoRepository } from './MongoRepository';
import { MongoDriver } from 'typeorm/driver/mongodb/MongoDriver';
import { NgerEntityManager } from './EntityManager';
export class NgerConnection extends Connection {
    readonly manager: NgerEntityManager;
    constructor(options: ConnectionOptions, public injector: Injector) {
        super(options)
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