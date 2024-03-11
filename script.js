const btnChuyendoi = document.querySelector(".btnChuyendoi");
const input = document.querySelector("input");
const result = document.querySelector("#result");
const result1 = document.querySelector("#result1");
const containerTable = document.querySelector(".containerTable");
const container = document.querySelector(".container");
const inputText = document.querySelector("#inputText");
const resultText = document.querySelector("#resultText");
let stack = [];
let output = [];
const dau = ["*", ")", "(", "-", "+", "%", "/", "^"];
const dau1 = ["*", "-", "+", "%", "/", "^"];
const kyTuDacBiet = [
  "!",
  "@",
  "#",
  "$",
  "&",
  "_",
  "|",
  "?",
  ";",
  ":",
  "~",
  "'",
  '"',
  "/",
  '{',
  '}',
  '[',
  ']',
  '>',
  '<',
  '=',

];

inputText.addEventListener("keyup", (e) => {
  if (e.keyCode === 13 && inputText.value.length > 0) {
    handleConvertToPrefix();
  }
});

document.getElementById("inputFile").addEventListener("change", function () {
  let fr = new FileReader();
  fr.onload = function () {
    document.getElementById("inputText").value = fr.result;
  };

  fr.readAsText(this.files[0]);
});

const isEmpty = (stack) => {
  return stack.length === 0 ? true : false;
};

const handleConvertToPrefix = () => {
  if (inputText.value.length > 0) {
    containerTable.innerHTML = "";
    document.querySelector(".tbodyTableResult").innerHTML = "";
    stack = [];
    output = [];
    let value = input.value.trim();
    value = value.replace(/\s/g, "");
    const ArrayString = [];
    let so = "";

    // Check số thập phân
    for (let i = 0; i < value.length; i++) {
      if (isNaN(value[i])) {
        ArrayString.push(value[i]);
      } else {
        if (isNaN(value[i + 1]) && value[i + 1] !== ".") {
          ArrayString.push(value[i]);
        } else {
          for (let j = i; j < value.length; j++) {
            so += value[j];
            if (isNaN(value[j + 1]) && value[j + 1] !== ".") {
              i = j;
              break;
            }
          }
          ArrayString.push(so);
          so = "";
        }
      }
    }
    //


    // Check kí tự đặc biệt
    if (ArrayString.some((t) => kyTuDacBiet.includes(t))) {
      alert("Biểu thức không thể chứa các ký tự đặc biệt");
      containerTable.innerHTML = "";
      document.querySelector(".tbodyTableResult").innerHTML = "";
      document.querySelector(".tableResult").style.display = "none";
      result.innerHTML = "";
      return;
    }
    //

    //
    if (
      dau.includes(ArrayString[0]) ||
      dau.includes(ArrayString[ArrayString.length - 1])
    ) {
      //kiểm tra đầu cuối có phải toán tử hay 0 vad ký tự đầu có phải dấu ) không
      if (
        (ArrayString[0] !== "(" && isNaN(ArrayString[0])) ||
        dau1.includes(ArrayString[ArrayString.length - 1])
      ) {
        alert("Sai biểu thức");

        containerTable.innerHTML = "";
        document.querySelector(".tbodyTableResult").innerHTML = "";
        document.querySelector(".tableResult").style.display = "none";
        result.innerHTML = "";
        return;
      }
    }
// check số lượng dấu đóng mở ngoạc có bằng nhau hay 0
    if (
      ArrayString.filter((e) => e === "(").length !==
      ArrayString.filter((e) => e === ")").length
    ) {
      alert("Sai biểu thức");
      containerTable.innerHTML = "";
      document.querySelector(".tbodyTableResult").innerHTML = "";
      result.innerHTML = "";
      document.querySelector(".tableResult").style.display = "none";
      return;
    }

    for (let i = 0; i < ArrayString.length; i++) {
      if (dau.includes(ArrayString[i]) && dau.includes(ArrayString[i + 1])) {
        //check sau dấu mở ngoặc có phải toán tử không
        if (ArrayString[i] === "(" && ArrayString[i + 1] !== "(") {
          alert("Sai biểu thức");

          containerTable.innerHTML = "";
          document.querySelector(".tbodyTableResult").innerHTML = "";
          result.innerHTML = "";
          document.querySelector(".tableResult").style.display = "none";
          return;
          // check sau đóng ngoặc có phải mở ngoặc không
        } else if (ArrayString[i] === ")" && ArrayString[i + 1] === "(") {
          alert("Sai biểu thức");

          if (resultText.classList.contains("none-active")) {
            resultText.classList.remove("none-active");
          }
          containerTable.innerHTML = "";
          document.querySelector(".tbodyTableResult").innerHTML = "";
          result.innerHTML = "";
          document.querySelector(".tableResult").style.display = "none";
          return;
        } else if (
          // check 2 toán tử có cạnh nhau không
          dau1.includes(ArrayString[i]) &&
          dau1.includes(ArrayString[i + 1])
        ) {
          alert("Sai biểu thức");
          containerTable.innerHTML = "";
          document.querySelector(".tbodyTableResult").innerHTML = "";
          result.innerHTML = "";
          document.querySelector(".tableResult").style.display = "none";
          return;
        } else if (
          //check sau toán tử đó có phải dấu )
          dau1.includes(ArrayString[i]) &&
          ArrayString[i + 1] === ")"
        ) {
          alert("Sai biểu thức");
          containerTable.innerHTML = "";
          document.querySelector(".tbodyTableResult").innerHTML = "";
          result.innerHTML = "";
          document.querySelector(".tableResult").style.display = "none";
          return;
        }
      }
    }

    if (!resultText.classList.contains("none-active")) {
      resultText.classList.add("none-active");
    }
    ArrayString.forEach((token) => {
      createMessage(`Xét "${token}": `);
      if (!dau.includes(token)) {
        output.push(token);
        createMessage(`"${token}" là số nên đẩy ra Output`);
        createTable();
        createTr(token, stack.join(", "), output.join(", "));
        createTrForTableResult(token, stack.join(", "), output.join(", "));
      } else {
        if (isEmpty(stack)) {
          stack.push(token);
          createMessage(
            `"${token}" không là số và stack rỗng nên đẩy "${token}" vào stack `
          );
          createTable();
          createTr(token, stack.join(", "), output.join(", "));
          createTrForTableResult(token, stack.join(", "), output.join(", "));
        } else {
          if (token === ")") {
            createMessage(
              `Token là dấu ")" nên chuyển lần lượt các dấu từ đỉnh stack sang output đến khi gặp dấu "(" thì xóa dấu "(" đó đi và dừng lại`
            );
            createTable();
            for (let i = stack.length - 1; i >= 0; i--) {
              if (stack[stack.length - 1] === "(") {
                stack.pop();
                createTr(token, stack.join(", "), output.join(", "));
                createTrForTableResult(
                  token,
                  stack.join(", "),
                  output.join(", ")
                );
                return;
              } else {
                output.push(stack[stack.length - 1]);
                stack.pop();

                createTr(token, stack.join(", "), output.join(", "));
                isFirst = false;
              }
            }
          } else if (token === "(") {
            stack.push(token);
            createMessage(`"${token}" là dấu "(" nên đẩy vào stack `);
            createTable();
            createTr(token, stack.join(", "), output.join(", "));
            createTrForTableResult(token, stack.join(", "), output.join(", "));
          } else if (stack[stack.length - 1] === "(") {
            createMessage(
              `Do toán tử ngoài cùng của stack là "(" nên đẩy "${token}" vào stack`
            );
            stack.push(token);
            createTable();
            createTr(token, stack.join(", "), output.join(", "));
            createTrForTableResult(token, stack.join(", "), output.join(", "));
          } else if (compare(token) > compare(stack[stack.length - 1])) {
            createMessage(
              `"${token}" có độ ưu tiên >" ${
                stack[stack.length - 1]
              }" nên đẩy "${token}" vào stack`
            );
            stack.push(token);
            createTable();
            createTr(token, stack.join(", "), output.join(", "));
            createTrForTableResult(token, stack.join(", "), output.join(", "));
          } else {
            output.push(stack[stack.length - 1]);
            createMessage(
              `"${token}" có độ ưu tiên < hoặc = toán tử ngoài cùng của stack ("${
                stack[stack.length - 1]
              }") nên chuyển "${
                stack[stack.length - 1]
              }" vào output và kiểm tra lại: Nếu stack rỗng hoặc toán tử ngoài cùng stack là  "(" hoặc "${token}" có độ ưu tiên > toán tử ngoài cùng stack thì chuyển "${token}" vào stack, nếu "${token}" có độ ưu tiên < toán tử ngoài cùng stack thì thêm toán tử ngoài cùng stack vào output và thực hiện lại`
            );
            stack.pop();
            check(token);
            createTable();
            createTr(token, stack.join(", "), output.join(", "));
            createTrForTableResult(token, stack.join(", "), output.join(", "));
          }
        }
      }
    });
    const stackReverse = [...stack].reverse();

    output = [...output, ...stackReverse];
    if (stackReverse.length > 0) {
      createMessage(
        `Token rỗng chuyển lần lượt các phần tử còn lại từ đầu stack ra output`
      );
      createTable();
      createTr("", stack.join(", "), output.join(", "));
      createTrForTableResult("", stack.join(", "), output.join(", "));
    }

    result.innerHTML = `Vậy biểu thức hậu tố của ${value} là: ${output.join(
      " "
    )}`;
    result1.innerHTML = `=> Biểu thức hậu tố của ${value} là: ${output.join(
      " "
    )}`;
    document.querySelector(".tableResult").style.display = "block";
  }
};
const compare = (text) => {
  if (text == "^") return 3;
  if (text == "*" || text == "/" || text == "%") return 2;
  if (text == "+" || text == "-") return 1;
  return 0;
};

// Check dấu
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
    output.push(token);
  } else {
    if (isEmpty(stack)) {
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
};

const createTr = (token, stack, output) => {
  const tbody = document.querySelectorAll(".stepResult");
  const tr = document.createElement("tr");
  const td = ` 
                    <td>${token}</td>
                    <td>${stack}</td>
                    <td>${output}</td>
                `;
  tr.innerHTML = td;
  tbody[tbody.length - 1].appendChild(tr);
};

const createMessage = (message) => {
  const h4 = document.createElement("h4");
  h4.innerHTML = message;
  containerTable.appendChild(h4);
};

const createTable = () => {
  const hang = `
            <thead>
                <tr>
                    <th>Token</th>
                    <th>Stack</th>
                    <th>Output</th>
                </tr>
            </thead>
            <tbody  class="stepResult"></tbody>
        `;
  var Table = document.createElement("table");
  Table.innerHTML = hang;
  containerTable.appendChild(Table);
};

const createTrForTableResult = (token, stack, output) => {
  const tbody = document.querySelector(".tbodyTableResult");
  const tr = document.createElement("tr");
  const td = ` 
                    <td>${token}</td>
                    <td>${stack}</td>
                    <td>${output}</td>
                `;
  tr.innerHTML = td;
  tbody.appendChild(tr);
};

const checkString = () => {};
