
/**
 * square brackets are "flags"
 * curly braces    are "args"
 */

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
    phrase: "alfred [get [my]][what's my][show me [my]] info [name, num]",
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
  // {
    // key: "stats",
    // phrase: "alfred [show me][global] stats [from {rest}]",
  // },
];

// "alfred order ed from me" => {
  // args: {
    // order: "ed",
    // rest: "me",
  // },
  // flags: {
    // me: false,
  // }
// }

// We should already have the model
const NOT_ALPHANUM = /[^A-Za-z0-9]/;
const parseText = (text) => {
  return model.reduce((memo, { key, phrase }) => {
    if (memo) return memo;

    let numArgs = 0;
    const argsRequired = phrase.split("{").length - 1;

    const output = { args: {}, flags: {} };
    let j = 0;
    for (let i = 0; i < text.length; i++) {
      // Collect flags
      while (phrase[j] === "[") {
        j++;

        let flags = [{
          name: "",
          match: true,
        }];
        while (flags.length > 0) {
          if (j > phrase.length) return false;

          switch (phrase[j]) {
            case "[": {
              flags.unshift({
                name: "",
                match: true,
              });
              j++;
              break;
            }

            case "]": {
              const flag = flags.shift();
              output.flags[flag.name] = flag.match;

              j++;
              while (j < phrase.length && isWs(phrase[j]) && !isWs(text[i])) j++;

              if (!flag.match) i -= flag.name.length;
              break;
            }

            default: {
              if (phrase[j] !== text[i] && !isWs(phrase[j])) {
                flags[0].match = false;
              }
              flags[0].name += phrase[j];
              i++;
              j++;
            }
          }
        }
        while (j < phrase.length && isWs(phrase[j]) && !isWs(text[i])) j++;
      }
      if (key === "order") console.log(j, phrase[j]);

      // Collect args
      if (phrase[j] === "{") {
        // Collect param
        let param = "";
        while (phrase[++j] !== "}") {
          if (j >= phrase.length) return false;
          param += phrase[j];
        }
        if (key === "order") console.log(param);
        j++;

        // Ignore whitespace
        while (isWs(phrase[j])) j++;

        // Collect value
        let val = "";
        while (text[i] !== phrase[j]) {
          if (i >= text.length) return false;
          val += text[i];
          i++;
        }
        output.args[param] = val.trim();
        numArgs++;
      }
      while (j < phrase.length && isWs(phrase[j]) && !isWs(text[i])) j++;
      if (phrase[j] !== text[i]) return false;
      j++;
    }
    output.key = key;
    return numArgs === argsRequired ? output : false;
  }, false);
};

const isWs = x => /^\s$/.test(x);

// console.log(parseText("alfred order me mango lassi from enwa"));
// console.log(parseText("alfred forget my order"));
// console.log(parseText("alfred set my info to ajay gandhi, hello"));
// console.log(parseText("alfred get info"));
// console.log(parseText("alfred set my favorite to xyz and abc from red chilli"));
console.log(parseText("alfred order"));
