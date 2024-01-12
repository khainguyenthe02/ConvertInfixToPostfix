const btnChuyendoi = document.querySelector(".btnChuyendoi");
const input = document.querySelector("input");
const result = document.querySelector("#result");
let stack = [];
let output = [];
const dau = ["*", ")", "(", "-", "+", "%", "/"];

const handleConvertToPrefix = () => {
  const value = input.value.trim();
  const ArrayString = [];
  let so = "";
  for (let i = 0; i < value.length; i++) {
    if (isNaN(value[i])) {
      ArrayString.push(value[i]);
    } else {
      if (isNaN(value[i + 1])) {
        ArrayString.push(value[i]);
      } else {
        for (let j = i; j < value.length; j++) {
          so += value[j];
          if (isNaN(value[j + 1])) {
            i = j;
            break;
          }
        }
        ArrayString.push(so);
        so = "";
      }
    }
  }
  if (ArrayString[0] === ")") {
    alert("sai biểu thức");
    return;
  }
  ArrayString.forEach((token) => {
    if (!dau.includes(token)) {
      output.push(token);
    } else {
      if (stack.length === 0) {
        stack.push(token);
      } else if (token === "(") {
        stack.push(token);
      } else {
        if (token === "(") {
          stack.push(token);
        } else if (compare(token) > compare(stack[stack.length - 1])) {
          stack.push(token);
        } else {
          if (token === ")") {
            for (let i = stack.length - 1; i >= 0; i--) {
              if (stack[stack.length - 1] === "(") {
                stack.pop();
                return;
              } else {
                output.push(stack[stack.length - 1]);
                stack.pop();
              }
            }
          } else {
            output.push(stack[stack.length - 1]);
            stack.pop();
            check(token);
          }
        }
      }
    }
  });
  const stackReverse = stack.reverse();
  output.concat(stackReverse);

  result.innerHTML = output.join(", ");
};
const compare = (text) => {
  if (text == "*" || text == "/" || text == "%") return 2;
  if (text == "+" || text == "-") return 1;
  return 0;
};

const check = (token) => {
  if (
    token !== "*" &&
    token !== "/" &&
    token !== "%" &&
    token !== "+" &&
    token !== "-" &&
    token !== "(" &&
    token !== ")"
  ) {
    output += token;
  } else {
    if (stack.length === 0) {
      stack.push(token);
    } else if (token === "(") {
      stack.push(token);
    } else {
      if (compare(token) > compare(stack[stack.length - 1])) {
        stack.push(token);
      } else {
        if (token === ")") {
          for (let i = stack.length - 1; i >= 0; i--) {
            if (stack[stack.length - 1] === "(") {
              stack.pop();
              return;
            } else {
              output += stack[stack.length - 1];
              stack.pop();
            }
          }
        } else {
          output += stack[stack.length - 1];
          stack.pop();
          check(token);
        }
      }
    }
  }
};
