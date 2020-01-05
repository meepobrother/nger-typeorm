import { getMetadataArgsStorage } from "../../";
import { EventListenerTypes } from "../../metadata/types/EventListenerTypes";
import { EntityListenerMetadataArgs } from "../../metadata-args/EntityListenerMetadataArgs";
import { createMethodDecorator } from '@nger/decorator';
export const BeforeUpdate = createMethodDecorator(`BeforeUpdate`, it => {
    getMetadataArgsStorage().entityListeners.push({
        target: it.type,
        propertyName: it.property,
        type: EventListenerTypes.BEFORE_UPDATE
    } as EntityListenerMetadataArgs);
})
