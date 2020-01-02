import { corePlatform, Module, getCurrentInjector } from '@nger/core'
import { TypeormModule, TypeormHook } from '../lib'
import { Entity, PrimaryGeneratedColumn, Column, QueryBuilder, Repository } from 'typeorm'
export class DefaultTypeormHook<T> extends TypeormHook<T>{
    before(qb: QueryBuilder<T>): void {
        console.log(qb, qb.alias)
    }
}
@Entity({
    name: `meepo_demo_user`
})
export class DemoUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string = `demo user name`;
}

@Entity({
    name: `meepo_demo_user2`
})
export class DemoUser2 {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: `demo user name`,
        nullable: true
    })
    name: string = `demo user name`;
}
@Module({
    imports: [
        TypeormModule.forRoot({
            type: 'postgres',
            name: 'root',
            username: `magnus`,
            password: `magnus`,
            host: `193.112.55.191`,
            port: 5432,
            database: `zp`,
            entities: [],
            synchronize: true
        }, DefaultTypeormHook),
        TypeormModule.forFeature([DemoUser, DemoUser2]),
    ]
})
export class AppModule { }
corePlatform().bootstrapModule(AppModule).then(async res => {
    let demoUser = res.get<Repository<DemoUser>>(DemoUser as any)
    const injector = getCurrentInjector()
    const user = new DemoUser();
    user.name = `user1`;
    await demoUser.save(user)
    let userList = await demoUser.find({})
    debugger;
})
