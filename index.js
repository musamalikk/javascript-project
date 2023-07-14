const history = [];
const variables = [];

setInterval(
  () =>
    (document.getElementById("time").innerHTML =
      new Date().toLocaleTimeString()),
  1000
);

const parenthesisCheck = (str) => {
  const stack = [];

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

const trigonometricCheck = (str) => {
  let value = str;
  if (str.includes("sin")) {
    value = value.replaceAll("sin", "Math.sin");
  }

  if (str.includes("cos")) {
    value = value.replaceAll("cos", "Math.cos");
  }

  if (str.includes("tan")) {
    value = value.replaceAll("tan", "Math.tan");
  }

  return value;
};

const exponentCheck = (str) => {
  let value = "";
  if (str.includes("^")) {
    value = str.replaceAll("^", "**");
  }

  if (value === "") {
    return str;
  }

  return value;
};

const squareRootCheck = (str) => {
  let value = "";
  if (str.includes("√")) {
    value = str.replaceAll("√", "Math.sqrt");
  }

  if (value === "") {
    return str;
  }

  return value;
};

const exponentialConstantCheck = (str) => {
  let value = "";
  // if (str === "e") {
  //   value = str.replaceAll("e", "Math.E");
  // } else
  if (str.includes("e")) {
    value = str.replaceAll("e", "Math.E");
  }

  if (value === "") {
    return str;
  }

  return value;
};

const pieCheck = (str) => {
  let value = "";
  // if (str === "π") {
  //   value = str.replaceAll("π", "Math.PI");
  // } else
  if (str.includes("π")) {
    value = str.replaceAll("π", "Math.PI");
  }

  if (value === "") {
    return str;
  }

  return value;
};

const expressionChecks = (str) => {
  return trigonometricCheck(
    exponentCheck(squareRootCheck(exponentialConstantCheck(pieCheck(str))))
  );
};

const historyListener = (element) => () => {
  document.getElementById("present").value = element;
};

const variableListener = (element) => () => {
  document.getElementById("present").value += element.value;
};

const historyRemoveListener = (element, container, li) => () => {
  const index = history.indexOf(element);
  if (index > -1) {
    history.splice(index, 1);
  }
  container.removeChild(li);
};

const populateHistory = () => {
  const container = document.getElementById("myArrayContainer");
  container.innerHTML = ""; // Clear the existing content

  history.forEach((element) => {
    const li = document.createElement("li");
    // li.textContent = element;
    li.classList.add("list-item", "flex", "justify-start", "items-center");

    const p = document.createElement("p");
    p.classList.add("mb-0");

    const span = document.createElement("span");
    span.classList.add("btn-close", "btn-sm", "text-danger", "ms-auto");

    p.textContent = element;
    // span.textContent = "x";

    p.onclick = historyListener(element);
    span.onclick = historyRemoveListener(element, container, li);

    li.appendChild(p);
    li.appendChild(span);

    container.appendChild(li);

    // console.log(history);
  });
};

const populateVariables = () => {
  const container = document.getElementById("variablesContainer");
  container.innerHTML = ""; // Clear the existing content

  variables.forEach((element) => {
    var li = document.createElement("li");
    li.textContent = element.name + "  -->  " + element.value;
    li.classList.add("list-item");
    li.onclick = variableListener(element);
    container.appendChild(li);
  });
};

const addMultiplicationOperator = (expression) => {
  // const regex = /(\d+|\))([a-zA-Z\(]|π|tan)|e(π)/g;
  // expression.replace(regex, "$1*$2");

  // const regex = /(\d+|\))([a-zA-Z\(]|tan)/g;
  // return expression.replace(regex, "$1*$2");

  const regex = /(?<=\d|\))(?=(?:sin|cos|tan)\()/g;
  return expression.replace(regex, "*");

  // const eRegex = /e(?!$|\*)/g;
  // return expression.replace(eRegex, "e*");
};

populateHistory();
populateVariables();

const result = () => {
  const value = document.getElementById("present").value;

  if (!parenthesisCheck(value)) {
    return alert("Add Proper Parenthesis!");
  }

  if (value.includes("/0"))
    return alert("Arithmetic Exception: Division by 0 Error!");

  if (value.includes("//"))
    return alert(
      "Enter the Correct Expression, Operators cannot be repeated consectively!"
    );

  if (value.includes("√(-")) return alert("Iota √(-1) Exception!");

  if (!value) return alert("Kindly Enter Some Expression to Proceed!");

  // const multiplicationOperator = addMultiplicationOperator(
  //   value.replaceAll("eπ", "e*π")
  // );
  // console.log("Multiplicator Operator value " + multiplicationOperator);

  // const newValue = expressionChecks(multiplicationOperator);
  const newValue = value;
  console.log("value " + newValue);
  // console.log("new value " + newValue);

  try {
    // const evaluatedValue = eval(newValue);
    // console.log(
    //   "spaces expression " +
    //     newValue.replace("/(d)(+-|[/*+-])(?=d)/g", "$1 $2 ")
    // );
    const resultValue = new InfixEvaluator(newValue).evaluate();
    // Math.abs(evaluatedValue) % 1 !== 0
    //   ? (eval(evaluatedValue) / 1).toFixed(4)
    //   : eval(evaluatedValue);

    console.log("eval value " + resultValue);

    document.getElementById("past").value = value;
    document.getElementById("present").value = resultValue;

    history.push(value);
    // console.log("history", history);
    // console.log("variables", variables);

    populateHistory();
    populateVariables();

    return;
  } catch (error) {
    return alert(error.message);
  }
};

const addVariable = (e) => {
  e.preventDefault();
  let exists = false;

  try {
    let name = document.getElementById("variableName").value;
    let value = document.getElementById("variableValue").value;

    variables.forEach((element) => {
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

      // var modal = new bootstrap.Modal(
      //   document.getElementById("addVariableModal")
      // );
      // modal.hide();

      // console.log(name, value);
      name = "";
      value = "";

      return alert("Variable has been added!");
    }
  } catch (error) {
    console.log(error);
  }
};

// class ----------------------------------------------------------------------------------------------------

class InfixEvaluator {
  constructor(expression) {
    this.expression = expression;
    this.precedence = {
      "(": 1,
      ")": 1,
      "+": 2,
      "-": 2,
      "*": 3,
      "^": 4,
    };
  }

  applyOperator(operators, operands) {
    const operator = operators.pop();
    const operand2 = operands.pop();
    const operand1 = operands.pop();

    let result;
    switch (operator) {
      case "^":
        result = Math.pow(operand1, operand2);
        break;
      case "*":
        result = operand1 * operand2;
        break;
      case "/":
        result = operand1 / operand2;
        break;
      case "+":
        result = operand1 + operand2;
        break;
      case "-":
        result = operand1 - operand2;
        break;
    }

    operands.push(result);
  }

  parse = () => {
    // return this.expression.replace(
    //   new RegExp(`[${["*", "-", "+", "/", "^"].join("")}]`, "g"),
    //   (match) => ` ${match} `
    // );

    return this.expression.replace(/([\+\-\*\/\^])/g, " $1 ");
  };

  evaluate() {
    this.expression = this.replaceExpressions();
    this.expression = this.parse();
    console.log("parse expression", this.expression);

    const tokens = this.expression.split(" ");
    const operators = [];
    const operands = [];

    tokens.forEach((token) => {
      if (!isNaN(parseFloat(token))) {
        operands.push(parseFloat(token));
      } else if (this.precedence[token]) {
        while (
          operators.length > 0 &&
          operators[operators.length - 1] !== "(" &&
          this.precedence[operators[operators.length - 1]] >=
            this.precedence[token]
        ) {
          this.applyOperator(operators, operands);
        }
        operators.push(token);
      } else if (token === "(") {
        operators.push(token);
      } else if (token === ")") {
        while (
          operators.length > 0 &&
          operators[operators.length - 1] !== "("
        ) {
          this.applyOperator(operators, operands);
        }
        operators.pop(); // Discard the "("
      }
    });

    while (operators.length > 0) {
      this.applyOperator(operators, operands);
    }

    return operands[0];
  }

  replaceExpressions = () => {
    const trigonometricPattern = /(sin|cos|tan)\(([^)]+)\)/g;
    const squareRootPattern = /√\((\d+(?:\.\d+)?)\)/g;

    const replacedExpression = this.expression
      .replace(trigonometricPattern, (match, func, angle) => {
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
      .replace(squareRootPattern, (match, num) => {
        const evaluatedValue = Math.sqrt(parseFloat(num));
        return evaluatedValue.toFixed(4);
      })
      .replaceAll("e", Math.E.toFixed(4))
      .replaceAll("π", Math.PI.toFixed(4));

    return replacedExpression;
  };
}
