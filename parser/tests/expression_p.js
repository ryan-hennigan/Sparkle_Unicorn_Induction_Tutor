import test from 'ava';
import parser from '../parser';
import util from './_common';

const { pass, fail, returns } = util('_Expression_P');

test('Accepts expression with spaces', pass, "( 3 )");
test('Accepts expression without spaces', pass, "(3)");
test('Accepts wrapping all expression types (1)', pass, "( 3 )");
test('Accepts wrapping all expression types (2)', pass, "( 3 - 4 )");
test('Accepts wrapping all expression types (3)', pass, "( 3 + 4 )");
test('Accepts wrapping all expression types (4)', pass, "( 3 / 4 )");
test('Accepts wrapping all expression types (5)', pass, "( 3 * 4 )");
test('Accepts wrapping all expression types (6)', pass, "( 3 ^ 4 )");
test('Accepts wrapping all expression types (7)', pass, "( ( 3 ) )");
test('Accepts wrapping sums', pass, '( \\sum_{i=1}^{3}{2i} )');
test('Accepts wrapping prods', pass, '( \\prod_{i=1}^{3}{2i} )');

test('Rejects incomplete expression (1)', fail, "( 3");
test('Rejects incomplete expression (2)', fail, "3 )");
test('Rejects incomplete expression (3)', fail, "( )");

test('Returns postfix (1)', returns, "( 3 )", ["3"]);
test('Returns postfix (2)', returns, "( 3 - 4 )", ["3", "4", "-"]);
test('Returns postfix (3)', returns, "( 3 + 4 )", ["3", "4", "+"]);
test('Returns postfix (4)', returns, "( 3 / 4 )", ["3", "4", "/"]);
test('Returns postfix (5)', returns, "( 3 * 4 )", ["3", "4", "*"]);
test('Returns postfix (6)', returns, "( 3 ^ 4 )", ["3", "4", "^"]);
test('Returns postfix (7)', returns, "( ( 3 ) )", ["3"]);
test('Returns postfix (8)', returns, '( \\sum_{i=1}^{3}{2i} )', [
  "sum",
  "i",
  "1","|",
  "3","|",
  "2","i","*","|"
]);
test('Returns postfix (9)', returns, '( \\prod_{i=1}^{3}{2i} )', [
  "prod",
  "i",
  "1","|",
  "3","|",
  "2","i","*","|"
]);