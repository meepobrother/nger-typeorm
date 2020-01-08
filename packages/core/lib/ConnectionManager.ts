import { ConnectionManager, ConnectionOptions } from './typeorm-native'
import { NgerConnection } from './Connection'
import { Injectable, Injector } from '@nger/core';
import { TYPEORM_NAME } from './token';
@Injectable()
export class NgerConnectionManager extends ConnectionManager {
    readonly connections: NgerConnection[];
    private name: string;
    constructor(private injector: Injector) {
        super();
        this.name = this.injector.get(TYPEORM_NAME, `default`)
    }
    has(name: string): boolean {
        return this.connections.some(it => it.name === name)
    }
    get(name?: string): NgerConnection {
        name = name || this.name;
        const connection = this.connections.find(it => it.name === name)
        if (connection) return connection;
        throw new Error(`can not found connection ${name}`)
    }
    create(options: ConnectionOptions): NgerConnection {
        const connection = new NgerConnection(options, this.injector)
        this.connections.push(connection);
        return connection;
    }
}