import { getMetadataArgsStorage } from "../../";
import { EventListenerTypes } from "../../metadata/metadata-types/EventListenerTypes";
import { EntityListenerMetadataArgs } from "../../metadata-args/EntityListenerMetadataArgs";
import { createMethodDecorator } from '@nger/decorator';
export const BeforeRemove = createMethodDecorator(`BeforeRemove`, it => {
    getMetadataArgsStorage().entityListeners.push({
        target: it.type,
        propertyName: it.property,
        type: EventListenerTypes.BEFORE_REMOVE
    } as EntityListenerMetadataArgs);
})
