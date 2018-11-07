const Parser = require("./index");
const parser = new Parser({
  "add": "add [a][an][the] {fruit} [to my list]",
  "remove": "remove {fruit} [from my list]",
});
console.log(parser.parse("add apples to my list"));
