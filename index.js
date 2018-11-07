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

module.exports = (function () {

  function Parser(model) {
    this.model = Object.keys(model).map((key) => ({
      key,
      phrase: model[key],
    }));
  }

  Parser.prototype.parse = function (text) {
    return this.model.reduce((memo, { key, phrase }) => {
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
          console.log(i, j);

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
  }

  return Parser;

})();
