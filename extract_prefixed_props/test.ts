import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { extractPrefixedProps, KeyPrefixer } from "./mod.ts";

Deno.test("extractPrefixedProps function", () => {
  type OriginalType = {
    name: string;
    age: number;
    email: string;
  };

  type PrefixedType = KeyPrefixer<'pre', OriginalType> & { nonPrefixedProp: string };

  const prefixedObject: PrefixedType = {
    preName: "John Doe",
    preAge: 30,
    preEmail: "john.doe@example.com",
    nonPrefixedProp: "This will be ignored"
  };

  const extracted = extractPrefixedProps('pre', prefixedObject);

  const expected: OriginalType = {
    name: "John Doe",
    age: 30,
    email: "john.doe@example.com"
  };

  assertEquals(extracted, expected);
});
