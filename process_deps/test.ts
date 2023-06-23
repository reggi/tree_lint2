import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts"
import { runDeps } from "./mod.ts"

export const ONLY = { only: true }

Deno.test('nested circular', () => {
  const out = {
    "a": {
      "b": {
        "c": {
          "d": {},
          "p": {},
          "o": {}
        },
        "f": {},
      },
      "q": {}
    }
  }

  assertEquals(runDeps({
    a: ["b", "q"],
    b: ["c", "f"],
    c: ["d", 'p', 'o'],
    p: ["o"],
    o: ["p"],
  }), out)

  assertEquals(runDeps({
    a: ["b", "q"],
    b: ["c", "f"],
    c: ["d", 'p', 'o'],
    p: ["o"],
    o: ["p"],
    d: [],
    q: [],
    f: [],
  }), out)

  assertEquals(runDeps({
    a: ["b", "q"],
    b: ["c", "f"],
    c: ["d", 'p'],
    p: ["o"],
    o: ["p"],
    d: [],
    q: [],
    f: [],
  }), out)

  const x = runDeps({
    a: ["b", "q"],
    b: ["c", "f"],
    c: ["d", 'o'],
    p: ["o"],
    o: ["p"],
    d: ['p'],
  })

  assertEquals(x, out)
})

Deno.test('root level circular', () => {
  assertEquals(runDeps({
    a: ["b", "q"],
    b: ["c", "f"],
    c: ["d"],
    p: ["o"],
    o: ["p"],
    d: [],
    q: [],
    f: [],
  }), {
    "a": {
      "b": {
        "c": {
          "d": {},
        },
        "f": {},
      },
      "q": {}
    },
    "p": {},
    "o": {}
  })
})

Deno.test('hoisted root "c"', () => {
  assertEquals(runDeps({
    a: ["b", "q"],
    b: ["c", "f"],
    c: ["d"],
    p: ["o"],
    o: ["p"],
    d: [],
    e: ["c"],
    q: [],
    f: [],
  }), {
    "a": {
      "b": {
        "f": {}
      },
      "q": {}
    },
    "e": {},
    "p": {},
    "o": {},
    "c": {
      "d": {}
    }
  })
})

Deno.test('simple nested', () => {
  assertEquals(runDeps({
    'a': ['b'],
    'b': ['c'],
    'c': [],
  }), {
    'a': {
      'b': {
        'c': {}
      }
    }
  })
})

Deno.test('two roots', () => {
  assertEquals(runDeps({
    'a': ['b', 'q'],
    'b': ['c', 'f'],
    'c': ['d'],
    'p': ['o'],
    'o': [],
    "d": [],
    'e': ['c'],
    "q": []
  }), {
    'a': {
      'b': {
        'f': {}
      },
      'q': {}
    },
    'c': {
      'd': {},
    },
    'e': {},
    'p': {
      'o': {}
    }
  })
})

Deno.test('many deps in one', () => {
  assertEquals(runDeps({
    'a': ['b', 'c', 'd', 'e'],
    'b': ['e'],
    'c': [],
    'd': [],
    'e': []
  }), {
    'a': {
      'b': {},
      'c': {},
      'd': {},
      'e': {}
    }
  })
})

Deno.test('nest "e" in "b"', () => {
  assertEquals(runDeps({
    'a': ['b', 'c', 'd'],
    'b': ['e'],
  }), {
    'a': {
      'b': {
        'e': {},
      },
      'c': {},
      'd': {},
    }
  })
})

Deno.test('just circular', () => {
  assertEquals(runDeps({
    a: ["b"],
    b: ["a"]
  }), {
    "a": {},
    "b": {}
  })
})

Deno.test('just 2x circular', () => {
  assertEquals(runDeps({
    a: ["b"],
    b: ["a"],
    c: ["d"],
    d: ["c"]
  }), {
    "a": {},
    "b": {},
    "c": {},
    "d": {},
  })
})

Deno.test('nested circular', () => {
  assertEquals(runDeps({
    x: ['b'],
    a: ["b"],
    b: ["a"],
    c: ["d"],
    d: ["c"]
  }), {
  "c": {},
  "d": {},
   x: {
    "a": {},
    "b": {},
   }
  })
})

Deno.test('nest tri-circular', () => {
  const out = {
    x: {
     "a": {},
     "b": {},
     "c": {},
    }
  }

  assertEquals(runDeps({
    x: ['b'],
    a: ["b", 'c'],
    b: ["a"],
    c: ["a"]
  }), out)
  
  assertEquals(runDeps({
    x: ['b'],
    a: ["b", 'c'],
    b: ["a"],
    c: ["b"]
  }), out)

  assertEquals(runDeps({
    a: ['c'],
    b: ["a"],
    c: ["b"]
  }), out.x)
})

Deno.test('tri-circular with depedant', () => {
  assertEquals(runDeps({
    x: ['b'],
    a: ["b", 'c'],
    b: ["a"],
    c: ["a", "d"],
    d: []
  }), {
    x: {
     "a": {},
     "b": {},
     "c": {
      "d": {}
     },
    }
  })
})

Deno.test('tri-circular with 2x depedant', () => {
  assertEquals(runDeps({
    x: ['b'],
    a: ["b", 'c'],
    b: ["a"],
    c: ["a", "d", 'f'],
    d: []
  }), {
    x: {
     "a": {},
     "b": {},
     "c": {
      "d": {},
      'f': {}
     },
    }
  })
})

Deno.test('tri-circular with nested seperate depedant', () => {
  assertEquals(runDeps({
    x: ['b'],
    a: ["b", 'c'],
    b: ["a"],
    c: ["a", "d"],
    f: ['d'],
    d: ['f']
  }), {
    x: {
     "a": {},
     "b": {},
     "c": {
      "d": {},
      'f': {}
     },
    }
  })
})