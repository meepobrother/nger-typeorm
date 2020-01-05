import { ColumnOptions, getMetadataArgsStorage } from "../../";
import { PrimaryGeneratedColumnNumericOptions } from "../options/PrimaryGeneratedColumnNumericOptions";
import { PrimaryGeneratedColumnUUIDOptions } from "../options/PrimaryGeneratedColumnUUIDOptions";
import { GeneratedMetadataArgs } from "../../metadata-args/GeneratedMetadataArgs";
import { createPropertyDecorator } from '@nger/decorator'

export type PrimaryGeneratedColumnOptions = PrimaryGeneratedColumnNumericOptions | PrimaryGeneratedColumnUUIDOptions
export const PrimaryGeneratedColumn = createPropertyDecorator<PrimaryGeneratedColumnOptions>(`PrimaryGeneratedColumn`, it => {
    const options: ColumnOptions & { strategy: any } = {
        ...it.options
    } as any;
    let strategy!: "increment" | "uuid" | "rowid";
    if (options && options.strategy) strategy = options.strategy;
    // if column type is not explicitly set then determine it based on generation strategy
    if (!options.type) {
        if (strategy === "increment") {
            options.type = Number;
        } else if (strategy === "uuid") {
            options.type = "uuid";
        } else if (strategy === "rowid") {
            options.type = "int";
        }
    }

    // explicitly set a primary and generated to column options
    options.primary = true;

    // register column metadata args
    getMetadataArgsStorage().columns.push({
        target: it.type,
        propertyName: it.property as string,
        mode: "regular",
        options: options
    });

    // register generated metadata args
    getMetadataArgsStorage().generations.push({
        target: it.type,
        propertyName: it.property,
        strategy: strategy
    } as GeneratedMetadataArgs);
})
