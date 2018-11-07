# text parser

> Parse text based on an inputted grammar

## Example (WIP)

```js
const model = {
  "add": "add [a][an][the] {fruit} [to my list]",
  "remove": "remove {fruit} [from my list]",
};

const Parser = require("text-parser");
const myParser = new Parser(model);
console.log(myParser.parse("add apples to my list"));
// outputs:
// {
//   key: "add",
//   args: {
//     fruit: "apples",
//   },
//   flags: {
//     a: false
//     an: false,
//     the: false,
//     "to my list": true,
//   },
// }
```
