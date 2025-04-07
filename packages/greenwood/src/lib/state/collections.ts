import { SignalMap } from "signal-utils/map";
import { getContentByCollection } from "@greenwood/cli/src/data/client.js";

import { type General } from "../../schemas/generals.ts";
import type { SkillBook } from "src/schemas/skillBooks.ts";
import type { Speciality } from "src/schemas/specialities.ts";

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);

class GeneralCollection {
  private _generalCollection = new SignalMap<string, General>();

  public get_general: (arg0: string) => General | undefined = (
    generalId: string
  ) => {
    if (this._generalCollection.has(generalId)) {
      return this._generalCollection.get(generalId);
    } else {
      return undefined;
    }
  };

  public set_general = (general: General) => {
    if (!this._generalCollection.has(general.name)) {
      this._generalCollection.set(general.name, general);
    }
  };

  public collection_size = () => {
    return this._generalCollection.size;
  };

  public get_all = () => {
    return Array.from(this._generalCollection.values());
  };

  public initialize = async () => {
    const generals = (await getContentByCollection("generals"))
      .map((generalPage) => {
        if (DEBUG) {
          console.log(`initialize inspecting page ${generalPage.title}`);
        }
        if (generalPage.data) {
          if (Object.keys(generalPage.data).includes("general")) {
            return JSON.parse(
              generalPage.data["general" as keyof typeof generalPage.data]
            ) as General;
          }
        }
        return null;
      })
      .filter((general): general is General => general !== null)
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    if (generals.length) {
      generals.forEach((general) => {
        this.set_general(general);
      });
    }
  };
}

class SkillBookCollection {
  private _collection = new SignalMap<string, SkillBook>();
  private collection_key = "skillbooks";
  private data_key = "skillbook";

  public get_book: (arg0: string) => SkillBook | undefined = (
    itemId: string
  ) => {
    if (this._collection.has(itemId)) {
      return this._collection.get(itemId);
    } else {
      return undefined;
    }
  };

  public set_book = (item: SkillBook) => {
    if (!this._collection.has(item.name)) {
      this._collection.set(item.name, item);
    }
  };

  public collection_size = () => {
    return this._collection.size;
  };

  public get_all = () => {
    return Array.from(this._collection.values());
  };

  public initialize = async () => {
    const items = (await getContentByCollection(this.collection_key))
      .map((itemPage) => {
        if (itemPage.data) {
          if (Object.keys(itemPage.data).includes(this.data_key)) {
            return JSON.parse(
              itemPage.data[this.data_key as keyof typeof itemPage.data]
            ) as SkillBook;
          }
        }
        return null;
      })
      .filter((item): item is SkillBook => item !== null)
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    if (items.length) {
      items.forEach((item) => {
        this.set_book(item);
      });
    }
  };
}

class SpecialitiesCollection {
  private _collection = new SignalMap<string, Speciality>();
  private collection_key = "specialities";
  private data_key = "speciality";

  public get_speciality: (arg0: string) => Speciality | undefined = (
    itemId: string
  ) => {
    if (this._collection.has(itemId)) {
      return this._collection.get(itemId);
    } else {
      return undefined;
    }
  };

  public set_book = (item: Speciality) => {
    if (!this._collection.has(item.name)) {
      this._collection.set(item.name, item);
    }
  };

  public collection_size = () => {
    return this._collection.size;
  };

  public get_all = () => {
    return Array.from(this._collection.values());
  };

  public initialize = async () => {
    const items = (await getContentByCollection(this.collection_key))
      .map((itemPage) => {
        if (itemPage.data) {
          if (Object.keys(itemPage.data).includes(this.data_key)) {
            return JSON.parse(
              itemPage.data[this.data_key as keyof typeof itemPage.data]
            ) as Speciality;
          }
        }
        return null;
      })
      .filter((item): item is Speciality => item !== null)
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    if (items.length) {
      items.forEach((item) => {
        this.set_book(item);
      });
    }
  };
}

class Collections {
  readonly generals = new GeneralCollection();
  readonly skillbooks = new SkillBookCollection();
  readonly specialities = new SpecialitiesCollection();

  public initialize = async () => {
    await Promise.all([
      this.generals.initialize(),
      this.skillbooks.initialize(),
      this.specialities.initialize(),
    ]);
  };
}

const collections = new Collections();

export default collections;
