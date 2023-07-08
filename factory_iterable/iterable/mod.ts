import { Constructor } from "../types.ts";

export class AddIterableMethods<
  T,
  S extends Constructor,
  P extends Constructor,
  ST,
  PT
> {
  underValue: T[];
  Singular: S;
  Plural: P;
  constructor(underValue: T[], Singular: S, Plural: P) {
    this.underValue = underValue;
    this.Singular = Singular;
    this.Plural = Plural;
  }
  filter(predicate: (value: InstanceType<S>) => boolean): InstanceType<P> {
    const values = this.underValue.map(v => new this.Singular(v));
    return new this.Plural(values.filter(predicate).map(v => v.value));
  }
  mapClone(func: (value: InstanceType<S>) => PT): InstanceType<P> {
    const values = this.underValue.map(v => new this.Singular(v));
    return new this.Plural(values.map(func));
  }
  map<T>(func: (value: InstanceType<S>) => T): T[] {
    const values = this.underValue.map(v => new this.Singular(v));
    return values.map(func)
  }
  forEach(func: (value: InstanceType<S>) => void): void {
    const values = this.underValue.map(v => new this.Singular(v));
    return values.forEach(func)
  }
  flatMap<T>(func: (value: InstanceType<S>) => T[]): T[] {
    const values = this.underValue.map(v => new this.Singular(v));
    return values.flatMap(func);
  }
  concat (...value: PT[]): InstanceType<P> {
    const values = this.underValue
    const influx = value.map(v => new this.Plural(v)).flatMap(v => v.value);
    return new this.Plural([...values, ...influx]);
  }
  some(predicate: (value: InstanceType<S>) => boolean): boolean {
    const values = this.underValue.map(v => new this.Singular(v));
    return values.some(predicate);
  }
  reduce<T>(reducer: (accumulator: T, value: InstanceType<S>) => T, initialValue: T): T {
    const values = this.underValue.map(v => new this.Singular(v));
    return values.reduce(reducer, initialValue);
  }
}