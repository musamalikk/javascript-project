setInterval(
  () =>
    (document.getElementById("time").innerHTML =
      new Date().toLocaleTimeString()),
  1000
);

const FontCheck = () => {
  var presentInput = document.getElementById("present");

  const adjustFontSize = () => {
    var maxWidth = presentInput.clientWidth;
    var fontSize = 3; // Starting font size

    while (presentInput.scrollWidth > maxWidth) {
      fontSize -= 0.1;
      presentInput.style.fontSize = fontSize + "rem";
    }
  };

  window.addEventListener("resize", adjustFontSize);
};

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
  let value = "";
  if (str.includes("sin")) {
    value = str.replace("sin", "Math.sin");
  }

  if (str.includes("cos")) {
    value = str.replace("cos", "Math.cos");
  }

  if (str.includes("tan")) {
    value = str.replace("tan", "Math.tan");
  }

  if (value === "") {
    return str;
  }

  return value;
};

const exponentCheck = (str) => {
  let value = "";
  if (str.includes("^")) {
    value = str.replace("^", "**");
  }

  if (value === "") {
    return str;
  }

  return value;
};

const squareRootCheck = (str) => {
  let value = "";
  if (str.includes("√")) {
    value = str.replace("√", "Math.sqrt");
  }

  if (value === "") {
    return str;
  }

  return value;
};

const expressionChecks = (str) => {
  return trigonometricCheck(exponentCheck(squareRootCheck(str)));
};

const history = [];

const result = () => {
  const value = document.getElementById("present").value;

  if (!parenthesisCheck(value)) {
    return alert("Add Proper Parenthesis!");
  }

  // const newValue = value.replace("tan(", "Math.tan(");
  // const newValue = trigonometricCheck(value);
  const newValue = expressionChecks(value);
  console.log("value " + value);
  console.log("new value " + newValue);

  history.push(newValue);

  // formattedNumber = (eval(newValue) / 1).toFixed(4);

  // const evaluatedValue = (eval(newValue) / 1).toFixed(4);
  const evaluatedValue = eval(newValue);
  console.log("eval value " + evaluatedValue);
  // console.log("parenthesisCheck " + );
  document.getElementById("past").value = value;
  document.getElementById("present").value = evaluatedValue;
  console.log("history", history);
};
