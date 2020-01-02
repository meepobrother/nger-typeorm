import { Repository, ObjectLiteral } from "typeorm";
import { Injector } from "@nger/core";

export class NgerRepository<Entity extends ObjectLiteral> extends Repository<Entity> { 
    injector: Injector;
}