import { getMetadataArgsStorage } from "../../";
import { TableMetadataArgs } from "../../metadata-args/TableMetadataArgs";
import { DiscriminatorValueMetadataArgs } from "../../metadata-args/DiscriminatorValueMetadataArgs";
import { createClassDecorator } from '@nger/decorator'

export const ChildEntity = createClassDecorator<any>(`ChildEntity`, it => {
    // register a table metadata
    const discriminatorValue = it.options;
    getMetadataArgsStorage().tables.push({
        target: it.type,
        type: "entity-child",
    } as TableMetadataArgs);

    // register discriminator value if it was provided
    if (discriminatorValue) {
        getMetadataArgsStorage().discriminatorValues.push({
            target: it.type,
            value: discriminatorValue
        } as DiscriminatorValueMetadataArgs);
    }
})
