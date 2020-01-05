import { getMetadataArgsStorage } from "../../";
import { TransactionRepositoryMetadataArgs } from "../../metadata-args/TransactionRepositoryMetadataArgs";
import { CannotReflectMethodParameterTypeError } from "../../error/CannotReflectMethodParameterTypeError";

/**
 * Injects transaction's repository into the method wrapped with @Transaction decorator.
 */
export function TransactionRepository(entityType?: Function): ParameterDecorator {
    return (object: Object, _methodName: string|symbol, index: number) => {
        const methodName = _methodName as string;
        // get repository type
        let repositoryType: Function;
        try {
            repositoryType = Reflect.getOwnMetadata("design:paramtypes", object, methodName)[index];
        } catch (err) {
            throw new CannotReflectMethodParameterTypeError(object.constructor, methodName);
        }

        getMetadataArgsStorage().transactionRepositories.push({
            target: object.constructor,
            methodName,
            index,
            repositoryType,
            entityType,
        } as TransactionRepositoryMetadataArgs);
    };
}
