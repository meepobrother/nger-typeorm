import { corePlatform, Module } from '@nger/core'
import { TypeormModule } from '../lib'
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
@Entity({
    name: `meepo_demo_user`
})
export class DemoUser extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
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
        }),
        TypeormModule.forFeature([DemoUser]),
    ]
})
export class AppModule { }
corePlatform().bootstrapModule(AppModule).then(async res => {
    let demoUser = res.get(DemoUser)
    debugger;
})
