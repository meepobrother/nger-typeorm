import { ColumnOptions, getMetadataArgsStorage } from "../../";
import { ColumnMetadataArgs } from "../../metadata-args/ColumnMetadataArgs";
import { createPropertyDecorator } from '@nger/decorator'
export const ObjectIdColumn = createPropertyDecorator<ColumnOptions>(`ObjectIdColumn`, it => {
    // if column options are not given then create a new empty options
    let options = it.options;
    if (!options) options = {} as ColumnOptions;
    options.primary = true;
    if (!options.name) options.name = "_id";
    // create and register a new column metadata
    getMetadataArgsStorage().columns.push({
        target: it.type,
        propertyName: it.property,
        mode: "objectId",
        options: options
    } as ColumnMetadataArgs);
})
