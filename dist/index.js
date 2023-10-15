"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoSQLDatabase = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class NoSQLDatabase {
    constructor(filePath) {
        this.database = {
            filePath,
            data: [],
        };
        this.loadDatabase();
    }
    loadDatabase() {
        try {
            const data = fs_1.default.readFileSync(this.database.filePath, "utf8");
            this.database.data = JSON.parse(data);
        }
        catch (error) {
            console.error(error);
        }
    }
    saveDatabase() {
        fs_1.default.writeFileSync(path_1.default.resolve(this.database.filePath), JSON.stringify(this.database.data, null, 2));
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
            const keys = this.findKeys(data);
            for (let key of keys) {
                const updatedItem = this.updateValueByPath(this.database.data[index], key, this.getValueByPath(data, key));
                this.database.data[index] = updatedItem;
                this.saveDatabase();
            }
            return this.database.data[index];
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
    findKeys(data, path = "") {
        const keys = [];
        for (const key in data) {
            const currentPath = path ? `${path}.${key}` : key;
            if (typeof data[key] === "object") {
                const subKeys = this.findKeys(data[key], currentPath);
                keys.push(...subKeys);
            }
            else {
                keys.push(currentPath);
            }
        }
        return keys;
    }
    getValueByPath(data, path) {
        const keys = path.split(".");
        let value = data;
        for (const key of keys) {
            if (value && typeof value === "object" && key in value) {
                value = value[key];
            }
            else {
                return undefined; // Se a chave não existe ou o valor não é um objeto, retorna undefined
            }
        }
        return value;
    }
    updateValueByPath(data, path, value) {
        const segments = path.split(".");
        let current = data;
        for (let i = 0; i < segments.length - 1; i++) {
            const segment = segments[i];
            if (!current[segment]) {
                current[segment] = {};
            }
            current = current[segment];
        }
        current[segments[segments.length - 1]] = value;
        return data;
    }
}
exports.NoSQLDatabase = NoSQLDatabase;
//# sourceMappingURL=index.js.map