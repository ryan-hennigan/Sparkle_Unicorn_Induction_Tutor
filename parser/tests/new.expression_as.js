import test from 'ava';
import parser from '../parser';
import util from './common';

const { pass, fail, returns } = util('_Expression_AS');

test('Accepts subtraction expression with spaces', pass, "10 - 13");
test('Accepts subtraction expression without spaces', pass, "10-13");
test('Accepts subtraction expression negative numbers (1)', pass, "-10 - -13");
test('Accepts subtraction expression negative numbers (2)', pass, "-10--13");
test('Accepts subtraction expression extension', pass, "10 - 13 - 12");
test('Accepts addition expression with spaces', pass, "10 + 13");
test('Accepts addition expression without spaces', pass, "10+13");
test('Accepts addition expression negative numbers (1)', pass, "-10 + -13");
test('Accepts addition expression negative numbers (2)', pass, "-10+-13");
test('Accepts addition expression extension', pass, "10 + 13 + 12");
test('Accepts nested md expressions (1)', pass, "10 + 13 * 11");
test('Accepts nested md expressions (2)', pass, "10 / 13 - 11");
test('Accepts nested md expressions (3)', pass, "10 * 11 - 18 * 17 * 14 - 2 + 3 - 4 / 7 * 6 - 3");

test('Rejects incomplete subtraction expression (1)', fail, "10 -");
test('Rejects incomplete subtraction expression (2)', fail, "- 13");
test('Rejects incomplete subtraction expression (3)', fail, "-");
test('Rejects incomplete addition expression (1)', fail, "10 +");
test('Rejects incomplete addition expression (2)', fail, "+ 13");
test('Rejects incomplete addition expression (3)', fail, "+");

test('Returns postfix subtraction (1)', returns, "10 - 13", ["10", "13", "-"]);
test('Returns postfix subtraction (2)', returns, "10-13", ["10", "13", "-"]);
test('Returns postfix subtraction (3)', returns, "-10 - -13", ["-10", "-13", "-"]);
test('Returns postfix subtraction (4)', returns, "-10--13", ["-10", "-13", "-"]);
test('Returns postfix subtraction (5)', returns, "10 - 20 - 30", ["10", "20", "-", "30", "-"]);
test('Returns postfix addition (1)', returns, "10 + 13", ["10", "13", "+"]);
test('Returns postfix addition (2)', returns, "10+13", ["10", "13", "+"]);
test('Returns postfix addition (3)', returns, "-10 + -13", ["-10", "-13", "+"]);
test('Returns postfix addition (4)', returns, "-10+-13", ["-10", "-13", "+"]);
test('Returns postfix addition (5)', returns, "10 + 20 + 30", ["10", "20", "+", "30", "+"]);
test('Returns postfix', returns, "10 - 20 + 30 - 40", ["10", "20", "-", "30", "+", "40", "-"]);
test('Nested md expressions are proper postfix (1)', returns, "10 + 13 * 11", ["10", "13", "11", "*", "+"]);
test('Nested md expressions are proper postfix (2)', returns, "10 / 13 - 11", ["10", "13", "/", "11", "-"]);
test('Nested md expressions are proper postfix (3)', returns, "10 * 11 - 18 * 17 * 14 - 2 + 3 - 4 / 7 * 6 - 3", [
  "10", "11", "*",
  "18", "17", "*", "14", "*",
  "-",
  "2",
  "-",
  "3",
  "+",
  "4", "7", "/", "6", "*",
  "-",
  "3",
  "-"
]);