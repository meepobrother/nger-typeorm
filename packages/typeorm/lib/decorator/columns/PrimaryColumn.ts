import { ColumnOptions, ColumnType, getMetadataArgsStorage } from "../../";
import { ColumnTypeUndefinedError } from "../../error/ColumnTypeUndefinedError";
import { PrimaryColumnCannotBeNullableError } from "../../error/PrimaryColumnCannotBeNullableError";
import { ColumnMetadataArgs } from "../../metadata-args/ColumnMetadataArgs";
import { GeneratedMetadataArgs } from "../../metadata-args/GeneratedMetadataArgs";
import { createPropertyDecorator } from '@nger/decorator'
export const PrimaryColumn = createPropertyDecorator<ColumnOptions>(`PrimaryColumn`, it => {
    let options = it.options;
    let type: ColumnType | undefined;
    if (!options) options = {} as ColumnOptions;
    // if type is not given explicitly then try to guess it
    const reflectMetadataType = it.propertyType;
    if (!type && reflectMetadataType)
        type = reflectMetadataType;
    // check if there is no type in column options then set type from first function argument, or guessed one
    if (!options.type && type)
        options.type = type;
    // if we still don't have a type then we need to give error to user that type is required
    if (!options.type)
        throw new ColumnTypeUndefinedError(it.type, it.property as string);

    // check if column is not nullable, because we cannot allow a primary key to be nullable
    if (options.nullable)
        throw new PrimaryColumnCannotBeNullableError(it.type, it.property as string);

    // explicitly set a primary to column options
    options.primary = true;

    // create and register a new column metadata
    getMetadataArgsStorage().columns.push({
        target: it.type,
        propertyName: it.property,
        mode: "regular",
        options: options
    } as ColumnMetadataArgs);

    if (options.generated) {
        getMetadataArgsStorage().generations.push({
            target: it.type,
            propertyName: it.property,
            strategy: typeof options.generated === "string" ? options.generated : "increment"
        } as GeneratedMetadataArgs);
    }
})
