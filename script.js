// =============================================
// script.js — All the calculator logic lives here
// This file is linked in index.html via:
// <script src="script.js"></script>
// It reads and updates elements from index.html
// =============================================

// --- STEP 1: Grab the screen elements from index.html ---
// document.getElementById() finds an element by its id=""
const disp = document.getElementById('display'); // the big number
const expr = document.getElementById('expr');     // the small history line

// --- STEP 2: Calculator memory (variables) ---
let current = '0';   // what the user is currently typing
let prev    = '';    // the previous number (before operator)
let op      = null;  // the operator: +, -, *, /
let fresh   = false; // true = next digit should START a new number

// --- STEP 3: Show a number on screen ---
function updateDisplay(val) {
  let s = String(val);

  // If number is too long, shorten it smartly
  if (s.length > 10) {
    let n = parseFloat(val);
    s = n.toPrecision(8).replace(/\.?0+$/, '');
    if (s.length > 10) s = n.toExponential(4);
  }

  disp.textContent = s; // put the text into the HTML element
}

// --- STEP 4: When a number button is pressed ---
function inputNum(n) {
  if (fresh) {
    current = n;     // start fresh number
    fresh = false;
  } else {
    // Don't allow more than 10 digits
    if (current.replace('-', '').replace('.', '').length >= 10) return;
    current = (current === '0') ? n : current + n;
  }
  updateDisplay(current);
}

// --- STEP 5: When the dot (.) button is pressed ---
function inputDot() {
  if (fresh) {
    current = '0.';
    fresh = false;
  } else if (!current.includes('.')) {
    current += '.';
  }
  updateDisplay(current);
}

// --- STEP 6: When an operator button is pressed (+, -, ×, ÷) ---
function inputOp(o) {
  // If there's already a pending operation, calculate it first
  if (op && !fresh) {
    prev = String(eval(prev + op + current));
    updateDisplay(prev);
  } else {
    prev = current;
  }

  op    = o;
  fresh = true; // next number press starts fresh

  // Show the expression history on screen (× and ÷ look nicer than * and /)
  let sym = o === '*' ? '×' : o === '/' ? '÷' : o;
  expr.textContent = prev + ' ' + sym;
}

// --- STEP 7: When = is pressed ---
function calculate() {
  if (!op) return; // nothing to calculate

  // eval() does the actual math e.g. eval("12 + 5") = 17
  let result = eval(prev + op + current);

  // Show full expression in the small line
  let sym = op === '*' ? '×' : op === '/' ? '÷' : op;
  expr.textContent = prev + ' ' + sym + ' ' + current + ' =';

  // Round to avoid floating point weirdness (0.1 + 0.2 = 0.30000000001)
  result  = Math.round(result * 1e10) / 1e10;
  current = String(result);
  updateDisplay(current);

  // Reset operator so next press starts a new calculation
  op    = null;
  fresh = true;
}

// --- STEP 8: AC button — clear everything ---
function clearAll() {
  current = '0';
  prev    = '';
  op      = null;
  fresh   = false;
  expr.textContent = '';
  updateDisplay('0');
}

// --- STEP 9: +/- button — flip the sign ---
function toggleSign() {
  current = String(parseFloat(current) * -1);
  updateDisplay(current);
}

// --- STEP 10: % button — divide by 100 ---
function inputPercent() {
  current = String(parseFloat(current) / 100);
  updateDisplay(current);
}

// --- STEP 11: Keyboard support ---
// So you can type numbers and operators from your keyboard too!
document.addEventListener('keydown', function(e) {
  if (e.key >= '0' && e.key <= '9') inputNum(e.key);
  else if (e.key === '.')            inputDot();
  else if (e.key === '+')            inputOp('+');
  else if (e.key === '-')            inputOp('-');
  else if (e.key === '*')            inputOp('*');
  else if (e.key === '/') { e.preventDefault(); inputOp('/'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Escape')       clearAll();
  else if (e.key === 'Backspace') {
    if (current.length > 1) current = current.slice(0, -1);
    else current = '0';
    updateDisplay(current);
  }
});
