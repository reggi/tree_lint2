// deno-lint-ignore-file no-explicit-any
import { arraysEqual } from "../array_equals/mod.ts";
import { AddIterableMethods } from "./iterable/mod.ts";
import { Constructor } from "./types.ts";

interface FactoryIterableOptions<T, SC = undefined, MC = undefined> {
  singleConverter?: (input: T | SC) => T;
  multipleConverter?: (input: T[] | SC | T | MC) => T[];
  typeGuard?: (value: any) => value is T;
}

export function FactoryIterable<T, SC = undefined, MC = undefined>(
  options: FactoryIterableOptions<T, SC, MC> = {}
) {
  type SingleType = T | SC | Single;
  class Single {
    value: T;
    TYPE!: SingleType;
    constructor(val: SingleType) {
      this.value = this.processValue(val);
    }
    processValue(val: SingleType): T {
      if (val instanceof Single) return val.value;
      if (options.singleConverter) return options.singleConverter(val);
      return val as T;
    }
    equals(value: SingleType): boolean {
      const _value = this.processValue(value);
      if (Array.isArray(this.value) && Array.isArray(_value)) {
        return arraysEqual(this.value, _value);
      } else {
        return this.value === _value;
      }
    }
  }

  type IterableType = SingleType | MC | Iterable
  type IterableStd = IterableType | IterableType[]

  abstract class Iterable<S extends Constructor = Constructor, P extends Constructor = Constructor> {
    value: T[];
    TYPE!: IterableStd;
    constructor(val: IterableStd) {
      this.value = this.processValue(val);
      this.has = this.has.bind(this)
      this.lacks = this.lacks.bind(this)
    }
    generate (Single: S, Plural: P) {
      return new AddIterableMethods<T, S, P, SingleType, IterableStd>(this.value, Single, Plural)
    }
    abstract arrayMethods: AddIterableMethods<T, S, P, SingleType, IterableStd>
    get filter () { return this.arrayMethods.filter.bind(this.arrayMethods) }
    get flatMap () { return this.arrayMethods.flatMap.bind(this.arrayMethods) }
    get map () { return this.arrayMethods.map.bind(this.arrayMethods) }
    get mapClone () { return this.arrayMethods.mapClone.bind(this.arrayMethods) }
    get concat () { return this.arrayMethods.concat.bind(this.arrayMethods) }
    get some () { return this.arrayMethods.some.bind(this.arrayMethods)}
    get reduce () { return this.arrayMethods.reduce.bind(this.arrayMethods)}
    get forEach () { return this.arrayMethods.forEach.bind(this.arrayMethods)}
    get length () { return this.value.length }
    get hasItems () { return this.value.length !== 0 }
    get isEmpty () { return this.value.length === 0 }
    get isOne () { return this.value.length === 1 }
    get hasMany() { return this.length >= 1 }
    get isMultiple() { return this.length > 1}
    get isSame () { return this.value.every((dir, _i, arr) => dir === arr[0]) }
    
    processValue(val: IterableStd): T[] {
      if (options.typeGuard && options.typeGuard(val)) return [new Single(val).value];
      if (Array.isArray(val)) return val.flatMap((item) => this.processValue(item));
      if (val instanceof Iterable) return val.value;
      if (val instanceof Single) return [val.value];
      if (options.multipleConverter) return options.multipleConverter(val);
      return [new Single(val as T | SC).value];
    }
    /** has any of the items in the iterable or single argument */
    has(value: IterableStd): boolean {
      const _value = this.processValue(value);
      return this.value.some((a) => _value.some((b) => new Single(a).equals(new Single(b))));
    }
    /** doesn't have any of the items in the iterable or single argument */
    lacks(value: IterableStd): boolean {
      const _value = this.processValue(value);
      return !this.has(_value)
    }
    filterValue(predi: (value: T) => boolean) {
      return this.value.filter(predi)
    }
    forEachValue(predi: (value: T) => void) {
      return this.value.forEach(predi)
    }
  }
  return [Single, Iterable] as const
}