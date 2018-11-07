
const Parser = require("../index");

const model = [
  {
    key: "order",
    phrase: "alfred order [me] [a][some] {order} from {rest}",
  },
  {
    key: "set info",
    phrase: "alfred [set [my]] info [to] {name},{number}",
  },
  {
    key: "get info",
    phrase: "alfred [get][what's][show me] [my] info [name, num]",
  },
  {
    key: "forget",
    phrase: "alfred forget [my] [info][favorite][order]",
  },
  {
    key: "set favorite",
    phrase: "alfred [set [my]] favorite [to] {order} from {rest}",
  },
  {
    key: "order favorite",
    phrase: "alfred order [[my] favorite]",
  },
  {
    key: "stats",
    phrase: "alfred [show me] [my][global][all][full] stats",
  },
];

const inputs = [
  "alfred order me mango lassi from newa",
  "alfred forget my order",
  "alfred set my info to ajay gandhi, hello",
  "alfred get my info",
  "alfred set my favorite to xyz and abc from red chilli",
  "alfred order",
  "alfred my stats",
];

const outputs = [
  {
    key: "order",
    args: {
      order: "mango lassi",
      rest: "newa",
    },
    flags: {
      me: true,
      a: false,
      some: false,
    },
  },
  {
    key: "forget",
    args: {},
    flags: {
      my: true,
      info: false,
      favorite: false,
      order: true,
    },
  },
  {
    key: "set info",
    args: {
      name: "ajay gandhi",
      number: "hello",
    },
    flags: {
      my: true,
      "set ": true,
      to: true,
    },
  },
  {
    key: "get info",
    args: {},
    flags: {
      get: true,
      "what\'s": false,
      "show me": false,
      my: true,
    },
  },
  {
    key: "set favorite",
    args: {
      order: "xyz and abc",
      rest: "red chilli",
    },
    flags: {
      my: true,
      "set ": true,
      to: true,
    },
  },
  {
    key: "order favorite",
    args: { },
    flags: {},
  },
  {
    key: "stats",
    args: {},
    flags: {
      my: true,
      "show me": false,
      all: false,
      full: false,
      global: false,
    },
  },
];

const parser = new Parser(model);

outputs.forEach((output, i) => {
  test(output.key, () => {
    expect(parser.parse(inputs[i])).toEqual(output);
  });
});

