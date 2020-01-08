import { Repository, ObjectLiteral } from "./typeorm-native";
import { Injector } from "@nger/core";

export class NgerRepository<Entity extends ObjectLiteral> extends Repository<Entity> { 
    injector: Injector;
}