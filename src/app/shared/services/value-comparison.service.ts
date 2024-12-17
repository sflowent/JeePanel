import { Injectable } from '@angular/core';
import { evaluate } from 'mathjs';

@Injectable({
  providedIn: 'root'
})
export class ValueComparaisonService {
  constructor() {}

  compare(value: any, expr: string): boolean {
    try {
      let result = this._compareWithOperator(value, expr);
      if (result != null) {
        return result;
      }

      result = this._compareWithExpression(value, expr);
      if (result != null) {
        return result;
      }

      return value == expr;
    } catch (e) {
      console.error(e);
    }

    return false;
  }

  _compareWithExpression(value: any, expr: string): boolean | null {
    const regexp = new RegExp('(%value%)');
    const containsOperator = regexp.test(expr.trim());
    if (containsOperator) {
      const expression = expr.replaceAll('%value%', value);
      return evaluate(expression);
    }

    return null;
  }

  _compareWithOperator(value: any, expr: string): boolean | null {
    const regexp = new RegExp('^(>|<|=)');
    const beginWithOperator = regexp.test(expr.trim());

    if (beginWithOperator) {
      return evaluate(+value + expr);
    }

    return null;
  }
}
