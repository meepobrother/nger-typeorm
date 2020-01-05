import { ColumnOptions, getMetadataArgsStorage } from "../../";
import { InheritanceMetadataArgs } from "../../metadata-args/InheritanceMetadataArgs";
import { createClassDecorator } from '@nger/decorator'
interface TableInheritanceOptions {
    pattern?: "STI"/*|"CTI"*/, column?: string | ColumnOptions
}
export const TableInheritance = createClassDecorator<TableInheritanceOptions>(`TableInheritance`, it => {
    const options = it.options;
    getMetadataArgsStorage().inheritances.push({
        target: it.type,
        pattern: options && options.pattern ? options.pattern : "STI",
        column: options && options.column ? typeof options.column === "string" ? { name: options.column } : options.column : undefined
    } as InheritanceMetadataArgs);
})
