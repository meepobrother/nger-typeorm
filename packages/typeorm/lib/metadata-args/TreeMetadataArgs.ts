import { TreeType } from "../metadata/metadata-types/TreeTypes";

/**
 * Stores metadata collected for Tree entities.
 */
export interface TreeMetadataArgs {

    /**
     * Entity to which tree is applied.
     */
    target: Function | string;

    /**
     * Tree type.
     */
    type: TreeType;

}
