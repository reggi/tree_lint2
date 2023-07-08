import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { deepDelete } from "./mod.ts";

Deno.test("deepDelete keepKey:false", () => {
  const obj = {
    "a": {
      "b": {
        "c": {
          "d": {
            "e": {
              "f": {
                "g": {},
                "h": {},
              },
            },
          },
        },
      },
    },
    "i": {
      "j": {
        "k": {
          "l": {
            "m": {
              "n": {
                "o": {},
              },
            },
          },
        },
      },
    },
  };
  const keys = ["c", "f", "k"];
  deepDelete(obj, keys);
  const expected = {
    "a": {
      "b": {},
    },
    "i": {
      "j": {},
    },
  };
  assertEquals(obj, expected);
});

Deno.test("deepDelete keepKey:true", () => {
  const obj = {
    "a": {
      "b": {
        "c": {
          "d": {
            "e": {
              "f": {
                "g": {},
                "h": {},
              },
            },
          },
        },
      },
    },
    "i": {
      "j": {
        "k": {
          "l": {
            "m": {
              "n": {
                "o": {},
              },
            },
          },
        },
      },
    },
  };
  const keys = ["c", "f", "k"];
  deepDelete(obj, keys, { keepKeys: true });
  const expected = {
    "a": {
      "b": {
        "c": {}
      },
    },
    "i": {
      "j": {
        "k": {}
      },
    },
  };
  assertEquals(obj, expected);
});
