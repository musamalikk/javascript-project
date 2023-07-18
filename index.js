let history = [];
let variables = [];

setInterval(() => (document.getElementById("time").innerHTML = new Date().toLocaleTimeString()), 1000);

const parenthesisCheck = str => {
  let stack = [];

  for (const char of str) {
    if (char === "(") {
      stack.push(char);
    } else if (char === ")") {
      if (stack.length === 0) {
        return false;
      }
      stack.pop();
    }
  }

  return stack.length === 0;
};
const historyListener = element => document.getElementById("present").value = element

const variableListener = element => {
  console.log("element",element)
  document.getElementById("present").value += element
}

const historyRemoveListener = (element, container, li) => {
  const index = history.indexOf(element);
  if (index > -1) {
    history.splice(index, 1);
  }
  container.removeChild(li);
};

const populateHistory = () => {
  const container = document.getElementById("myArrayContainer");
  container.innerHTML = "";

  history.forEach((element) => {
    const li = document.createElement("li");
    const p = document.createElement("p");
    const span = document.createElement("span");

    li.classList.add("list-item", "flex", "justify-start", "items-center");
    p.classList.add("mb-0");
    span.classList.add("btn-close", "btn-sm", "text-danger", "ms-auto");
    p.textContent = element;
    p.addEventListener("click", () => historyListener(element))
    span.addEventListener("click", () => historyRemoveListener(element, container, li))

    li.appendChild(p);
    li.appendChild(span);
    container.appendChild(li);
  });
};

const populateVariables = () => {
  const container = document.getElementById("variablesContainer");
  container.innerHTML = "";

  variables.forEach((element) => {
    var li = document.createElement("li");
    li.textContent = element.name + "  -->  " + element.value;
    li.classList.add("list-item");
    li.addEventListener("click", () => variableListener(element.value))
    container.appendChild(li);
  });
};

populateHistory();
populateVariables();

const result = () => {
  const value = document.getElementById("present").value;

  if (!parenthesisCheck(value)) return alert("Add Proper Parenthesis!");
  if (value.includes("/0"))
    return alert("Arithmetic Exception: Division by 0 Error!");
  if (value.includes("//"))
    return alert(
      "Enter the Correct Expression, Operators cannot be repeated consectively!"
    );
  if (value.includes("√(-")) return alert("Iota √(-1) Exception!");
  if (!value) return alert("Kindly Enter Some Expression to Proceed!");

  try {
    const resultValue = evalInfix(value);
    const end =
      Math.abs(resultValue) % 1 !== 0
        ? (eval(resultValue) / 1).toFixed(4)
        : eval(resultValue);

    document.getElementById("past").value = value;
    document.getElementById("present").value = end;
    history.push(value);
    populateHistory();
    populateVariables();

    return;
  } catch (error) {
    return alert(error.message);
  }
};

const addVariable = e => {
  e.preventDefault();
  let exists = false;
  let name = document.getElementById("variableName").value;
  let value = document.getElementById("variableValue").value;

  variables.forEach(element => {
    if (element.name === name) {
      exists = true;
    }
  });

  if (exists) {
    return alert("Variable Already Exists!");
  } else {
    variables.push({
      name: name,
      value: value,
    });

    populateVariables();

    document.getElementById("variableName").value = "";
    document.getElementById("variableValue").value = "";

    alert("Variable has been added!");
  }
};

const evalInfix = expr => {
  const replacedExpression = replaceExpressions(expr);
  const parsedValue = parse(replacedExpression);
  const tokens = parsedValue.split(" ");
  let operators = [], operands = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (!isNaN(parseFloat(token))) 
      operands.push(parseFloat(token)) 
    else if (isOperator(token)) {
      while (
        operators.length > 0 &&
        operators[operators.length - 1] !== "(" &&
        precedence(operators[operators.length - 1]) >= precedence(token)
      ) applyOperator(operators, operands);
      operators.push(token);
    } else if (token === "(") operators.push(token)
     else if (token === ")") {
      while (operators.length > 0 && operators[operators.length - 1] !== "(") {
        applyOperator(operators, operands);
      }
      operators.pop();
    }
  }
  while (operators.length > 0) applyOperator(operators, operands)

  return operands[0];
};

const applyOperator = (operators, operands) => {
  const operator = operators.pop();
  const operand2 = operands.pop();
  const operand1 = operands.pop();

  let result;
  switch (operator) {
    case "+":
      result = operand1 + operand2;
      break;
    case "-":
      result = operand1 - operand2;
      break;
    case "*":
      result = operand1 * operand2;
      break;
    case "/":
      result = operand1 / operand2;
      break;
    case "^":
      result = Math.pow(operand1, operand2);
      break;
  }

  operands.push(result);
};

const isOperator = token =>  ["+", "-", "*", "/", "^"].includes(token)
const precedence = operator => {
  switch (operator) {
    case "+":
    case "-":
      return 1;
    case "*":
    case "/":
      return 2;
    case "^":
      return 3;
    default:
      return 0;
  }
};

const replaceExpressions = expression => {
  const trigonometricPattern = /(sin|cos|tan)\(([^)]+)\)/g;
  const squareRootPattern = /√\((\d+(?:\.\d+)?)\)/g;

  const replacedExpression = expression.replace(trigonometricPattern, (match, func, angle) => {
      const angleInDegrees = parseFloat(angle);
      const angleInRadians = (angleInDegrees * Math.PI) / 180;

      switch (func) {
        case "sin":
          return Math.sin(angleInRadians).toFixed(4);
        case "cos":
          return Math.cos(angleInRadians).toFixed(4);
        case "tan":
          return Math.tan(angleInRadians).toFixed(4);
        default:
          return match;
      }
    })
    .replace(squareRootPattern, (match, num) => Math.sqrt(parseFloat(num)).toFixed(4))
    .replaceAll("e", Math.E.toFixed(4))
    .replaceAll("π", Math.PI.toFixed(4))
    .replaceAll(/\+-/g, "-");

  return replacedExpression;
};

const parse = expr => expr.replace(/([\+\-\*\/\^\(\)])/g, " $1 ");
