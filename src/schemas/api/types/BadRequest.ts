export type BadRequest = {
    /**
     * @type array | undefined
    */
    errors?: {
        /**
         * @type string
        */
        message: string;
    }[];
    /**
     * @type string
    */
    message: string;
};