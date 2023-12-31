import fs from "fs";
import path from "path";
export interface Database<T> {
  filePath: string;
  data: T[];
}

export class NoSQLDatabase<T> {
  private database: Database<T>;

  public constructor(filePath: string) {
    this.database = {
      filePath,
      data: [],
    };
    this.loadDatabase();
  }

  private loadDatabase(): void {
    try {
      const data: string = fs.readFileSync(this.database.filePath, "utf8");
      this.database.data = JSON.parse(data);
    } catch (error) {
      console.error(error);
    }
  }

  private saveDatabase(): void {
    fs.writeFileSync(
      path.resolve(this.database.filePath),
      JSON.stringify(this.database.data, null, 2)
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private findItem(obj: T, w: Partial<T>): boolean {
    for (const key in w) {
      if (typeof w[key] === "object" && typeof obj[key] === "object") {
        if (!this.findItem(obj[key] as T, w[key] as Partial<T>)) {
          return false;
        }
      } else if (obj[key] !== w[key]) {
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
  public findUnique({ where }: { where: Partial<T> }): T | null {
    return (
      this.database.data.find((item) => this.findItem(item, where)) || null
    );
  }
  /**
   * Delete a unique item from the database based on the specified criteria.
   *
   * @param where - Criteria to match for deleting the item.
   */
  public deleteUnique({ where }: { where: Partial<T> }): boolean {
    const index: number = this.database.data.findIndex((item) =>
      this.findItem(item, where)
    );

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
  public update({
    where,
    data,
  }: {
    where: Partial<T>;
    data: Partial<T>;
  }): T | null {
    const index: number = this.database.data.findIndex((item) =>
      this.findItem(item, where)
    );

    if (index !== -1) {
      const keys = this.findKeys(data);
      for (let key of keys) {
        const updatedItem = this.updateValueByPath(
          this.database.data[index],
          key,
          this.getValueByPath(data, key)
        );
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
  public findMany({ where }: { where: Partial<T> }): T[] {
    return this.database.data.filter((item) => this.findItem(item, where));
  }
  /**
   * Delete multiple items from the database based on the specified criteria.
   *
   * @param where - Criteria to match for deleting multiple items.
   */
  public deleteMany({ where }: { where: Partial<T> }): number {
    const indexesToDelete: number[] = [];
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
  public create({ create }: { create: T }): T {
    const newItem: T = { id: this.generateId(), ...create };
    this.database.data.push(newItem);
    this.saveDatabase();
    return newItem;
  }

  private findKeys(data: any, path = ""): string[] {
    const keys: string[] = [];

    for (const key in data) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof data[key] === "object") {
        const subKeys = this.findKeys(data[key], currentPath);
        keys.push(...subKeys);
      } else {
        keys.push(currentPath);
      }
    }

    return keys;
  }

  private getValueByPath(data: any, path: string): any {
    const keys = path.split(".");
    let value = data;

    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        return undefined; // Se a chave não existe ou o valor não é um objeto, retorna undefined
      }
    }

    return value;
  }
  private updateValueByPath(data: any, path: string, value: any): any {
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
