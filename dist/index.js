"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoSQLDatabase = void 0;
const fs_1 = __importDefault(require("fs"));
class NoSQLDatabase {
    constructor(fileName) {
        this.database = {
            fileName,
            data: [],
        };
        this.loadDatabase();
    }
    loadDatabase() {
        try {
            const data = fs_1.default.readFileSync(this.database.fileName, "utf8");
            this.database.data = JSON.parse(data);
        }
        catch (error) {
            console.error(error);
        }
    }
    saveDatabase() {
        fs_1.default.writeFileSync(this.database.fileName, JSON.stringify(this.database.data, null, 2));
    }
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
    findItem(obj, w) {
        for (const key in w) {
            if (typeof w[key] === "object" && typeof obj[key] === "object") {
                if (!this.findItem(obj[key], w[key])) {
                    return false;
                }
            }
            else if (obj[key] !== w[key]) {
                return false;
            }
        }
        return true;
    }
    /**
     * Find a unique item in the database based on the specified criteria.
     *
     * @param where - Criteria to match for finding the item.
     */
    findUnique({ where }) {
        return (this.database.data.find((item) => this.findItem(item, where)) || null);
    }
    /**
     * Delete a unique item from the database based on the specified criteria.
     *
     * @param where - Criteria to match for deleting the item.
     */
    deleteUnique({ where }) {
        const index = this.database.data.findIndex((item) => this.findItem(item, where));
        if (index !== -1) {
            this.database.data.splice(index, 1);
            this.saveDatabase();
            return true;
        }
        return false;
    }
    /**
     * Update an item in the database based on the specified criteria and new data.
     *
     * @param where - Criteria to match for updating the item.
     * @param data - New data to update the item with.
     */
    update({ where, data, }) {
        const index = this.database.data.findIndex((item) => this.findItem(item, where));
        if (index !== -1) {
            const updatedItem = { ...this.database.data[index], ...data };
            this.database.data[index] = updatedItem;
            this.saveDatabase();
            return updatedItem;
        }
        return null;
    }
    /**
     * Find multiple items in the database based on the specified criteria.
     *
     * @param where - Criteria to match for finding multiple items.
     */
    findMany({ where }) {
        return this.database.data.filter((item) => this.findItem(item, where));
    }
    /**
     * Delete multiple items from the database based on the specified criteria.
     *
     * @param where - Criteria to match for deleting multiple items.
     */
    deleteMany({ where }) {
        const indexesToDelete = [];
        this.database.data.forEach((item, index) => {
            if (this.findItem(item, where)) {
                indexesToDelete.push(index);
            }
        });
        indexesToDelete.reverse().forEach((index) => {
            this.database.data.splice(index, 1);
        });
        if (indexesToDelete.length > 0) {
            this.saveDatabase();
        }
        return indexesToDelete.length;
    }
    /**
     * Create a new item and add it to the database.
     *
     * @param create - Data for creating a new item.
     */
    create({ create }) {
        const newItem = { id: this.generateId(), ...create };
        this.database.data.push(newItem);
        this.saveDatabase();
        return newItem;
    }
}
exports.NoSQLDatabase = NoSQLDatabase;
//# sourceMappingURL=index.js.map