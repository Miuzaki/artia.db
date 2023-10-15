export interface Database<T> {
    filePath: string;
    data: T[];
}
export declare class NoSQLDatabase<T> {
    private database;
    constructor(filePath: string);
    private loadDatabase;
    private saveDatabase;
    private generateId;
    private findItem;
    /**
     * Find a unique item in the database based on the specified criteria.
     *
     * @param where - Criteria to match for finding the item.
     */
    findUnique({ where }: {
        where: Partial<T>;
    }): T | null;
    /**
     * Delete a unique item from the database based on the specified criteria.
     *
     * @param where - Criteria to match for deleting the item.
     */
    deleteUnique({ where }: {
        where: Partial<T>;
    }): boolean;
    /**
     * Update an item in the database based on the specified criteria and new data.
     *
     * @param where - Criteria to match for updating the item.
     * @param data - New data to update the item with.
     */
    update({ where, data, }: {
        where: Partial<T>;
        data: Partial<T>;
    }): T | null;
    /**
     * Find multiple items in the database based on the specified criteria.
     *
     * @param where - Criteria to match for finding multiple items.
     */
    findMany({ where }: {
        where: Partial<T>;
    }): T[];
    /**
     * Delete multiple items from the database based on the specified criteria.
     *
     * @param where - Criteria to match for deleting multiple items.
     */
    deleteMany({ where }: {
        where: Partial<T>;
    }): number;
    /**
     * Create a new item and add it to the database.
     *
     * @param create - Data for creating a new item.
     */
    create({ create }: {
        create: T;
    }): T;
    private findKeys;
    private getValueByPath;
    private updateValueByPath;
}
//# sourceMappingURL=index.d.ts.map