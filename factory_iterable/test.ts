import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { FactoryIterable } from "./mod.ts";

Deno.test('factory_iterable', () => {
  type PlainPerson = {
    name: string,
    age: number,
  }

  const [ProtoPerson, ProtoPeople] = FactoryIterable<PlainPerson>({
    multipleConverter: (value: PlainPerson | PlainPerson[] | undefined): PlainPerson[] => {
      if (value instanceof Array) {
        return value;
      } else if (typeof value === "object") {
        return [value];
      }
      throw new Error("Invalid value");
    },
  })

  class Person extends ProtoPerson {
    get name () {
      return this.value.name;
    }
    get age () {
      return this.value.age;
    }
  }

  class People extends ProtoPeople<typeof Person, typeof People> {
    arrayMethods = this.generate(Person, People);
  }

  const john = new Person({ name: "John", age: 20 })
  const sally = new Person({ name: "Sally", age: 18 })
  const frank = new Person({ name: "Frank", age: 25 })
  const alice = new Person({ name: "Alice", age: 22 })
  const people = new People([john, sally, frank, alice])
  
  const overTwenty = people.filter(person => person.age >= 20)
  assertEquals(overTwenty.length, 3)
  assertEquals(overTwenty.value, [
    john.value,
    frank.value,
    alice.value,
  ])
})

Deno.test('factory_iterable inputs', () => {
  type PlainPerson = {
    name: string,
    age: number,
  }

  const [ProtoPerson, ProtoPeople] = FactoryIterable<PlainPerson>({
    multipleConverter: (value: PlainPerson | PlainPerson[] | undefined): PlainPerson[] => {
      if (value instanceof Array) {
        return value;
      } else if (typeof value === "object") {
        return [value];
      }
      throw new Error("Invalid value");
    },
  })

  class Person extends ProtoPerson {
    get name () {
      return this.value.name;
    }
    get age () {
      return this.value.age;
    }
  }

  class People extends ProtoPeople<typeof Person, typeof People> {
    arrayMethods = this.generate(Person, People);
  }

  const plainJohn = { name: "John", age: 20 }
  const john = new Person(plainJohn)
  const john2 = new Person(john)
  
  assertEquals(john.value, plainJohn)
  assertEquals(john2.value, plainJohn)

  const a = new People(plainJohn)
  const b = new People(john)
  const c = new People(a)
  const d = new People(b)
  const e = new People([plainJohn])
  const f = new People([john])
  const g = new People([a])

  assertEquals(a.value, [plainJohn])
  assertEquals(b.value, [plainJohn])
  assertEquals(c.value, [plainJohn])
  assertEquals(d.value, [plainJohn])
  assertEquals(e.value, [plainJohn])
  assertEquals(f.value, [plainJohn])
  assertEquals(g.value, [plainJohn])
})