import { EntityManagerFactory } from 'typeorm/entity-manager/EntityManagerFactory'
import { QueryRunner } from 'typeorm'
import { MongoDriver } from 'typeorm/driver/mongodb/MongoDriver'
import { SqljsDriver } from 'typeorm/driver/sqljs/SqljsDriver'
import { MongoEntityManager } from 'typeorm/entity-manager/MongoEntityManager'
import { SqljsEntityManager } from 'typeorm/entity-manager/SqljsEntityManager'
import { NgerEntityManager } from './EntityManager'
import { NgerConnection } from './Connection'
export class NgerEntityManagerFactory extends EntityManagerFactory {
    create(connection: NgerConnection, queryRunner?: QueryRunner) {
        if (connection.driver instanceof MongoDriver)
            return new MongoEntityManager(connection);
        if (connection.driver instanceof SqljsDriver)
            return new SqljsEntityManager(connection, queryRunner);
        return new NgerEntityManager(connection, queryRunner);
    }
}