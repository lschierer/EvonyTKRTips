/**
 * @description A summary form of the Basic Attributes, after they have been instantiated at a particular level and computed.
*/
export type BasicAttributesSummary = {
    /**
     * @type integer | undefined
    */
    attack?: number;
    /**
     * @type integer | undefined
    */
    defense?: number;
    /**
     * @type integer | undefined
    */
    politics?: number;
    /**
     * @type integer | undefined
    */
    leadership?: number;
    /**
     * @type integer | undefined
    */
    attack_base?: number;
    /**
     * @type integer | undefined
    */
    defense_base?: number;
    /**
     * @type integer | undefined
    */
    politics_base?: number;
    /**
     * @type integer | undefined
    */
    leadership_base?: number;
    /**
     * @type integer | undefined
    */
    attack_increment?: number;
    /**
     * @type integer | undefined
    */
    defense_increment?: number;
    /**
     * @type integer | undefined
    */
    politics_increment?: number;
    /**
     * @type integer | undefined
    */
    leadership_increment?: number;
};