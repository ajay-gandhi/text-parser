
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
  //         alfred my stats
    // phrase: "alfred [show me][my][global][all][full] stats [from {rest}]",
  },
];

// We should already have the model
const NOT_ALPHANUM = /[^A-Za-z0-9]/;
const parseText = (text) => {
  return model.reduce((memo, { key, phrase }) => {
    if (memo) return memo;

    const output = { key, args: {}, flags: {} };
    let j = 0, i = 0;
    while (j < phrase.length || i < text.length) {
      // Non-match conditions
      if (j >= phrase.length) return false;
      if (i >= text.length) {
        return isOptional(phrase.substring(j)) && output;
      }

      // Collect flags
      while (phrase[j] === "[") {
        j++;

        const flags = [{
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
              output.flags[flag.name] = flags.reduce((m, f) => m && f.match, flag.match);

              j++;

              if (!output.flags[flag.name]) {
                i -= flag.name.length;
              }
              while (j < phrase.length && isWs(phrase[j]) && !isWs(text[i])) j++;
              break;
            }

            default: {
// TODO: remove isWs
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

      // Collect args
      if (phrase[j] === "{") {
        // Collect param
        let param = "";
        while (phrase[++j] !== "}") {
          if (j >= phrase.length) return false;
          param += phrase[j];
        }
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
      }

      // Compare text
      while (j < phrase.length && isWs(phrase[j]) && !isWs(text[i])) j++;
      if (phrase[j] !== text[i]) {
        return false;
      }
      j++;
      i++;
    }
    return output;
  }, false);
};

const isWs = s => /^\s$/.test(s);
const isOptional = (s) => {
  let opens = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "[") {
      opens++;
    } else if (s[i] === "]") {
      opens--;
    } else if (!isWs(s[i])) {
      if (opens <= 0) return false;
    }
  }
  return true;
};

// console.log(parseText("alfred order me mango lassi from enwa"));
// console.log(parseText("alfred forget my order"));
// console.log(parseText("alfred set my info to ajay gandhi, hello"));
// console.log(parseText("alfred get my info"));
// console.log(parseText("alfred set my favorite to xyz and abc from red chilli"));
// console.log(parseText("alfred order"));
// console.log(parseText("alfred my stats"));
