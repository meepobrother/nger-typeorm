import { QueryRunner, SqljsEntityManager, EntityManagerFactory, MongoDriver, SqljsDriver, MongoEntityManager } from '@nger/typeorm-native'
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