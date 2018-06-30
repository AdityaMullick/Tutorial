define(
    /* Class name */
    'main/runtime/_ast/ConditionDirective',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert', 'lodash', 'main/runtime/_ast/Directive'],

    /* Class symbols */
    function (Diff, assert, lodash, Directive) {

        'use strict';

        /**
         * @class Directive constructor
         *
         */
        function ConditionDirective(operand1, operator, operand2) {
            /* Super constructor */
            Directive.call(this);
            this.is_binary = operand2 === undefined ? false : true;
            this.has_operator = operator === undefined ? false : true;

            this.operand1 = operand1;
            this.operand2 = operand2;
            this.operator = operator;
        }

        /* Super class */
        ConditionDirective.prototype = new Directive();

        /**
         * Evaluates the condition directive with the evaluated operands.
         * @param eval_op1
         * @param eval_op2
         * @return boolean value representing the evaluated condition
         */
        ConditionDirective.prototype.eval = function(eval_op1, eval_op2) {
            if (this.is_binary) {
                switch(this.operator) {
                    case ">":
                        return eval_op1 > eval_op2;
                    case ">=":
                        return eval_op1 >= eval_op2;
                    case "<":
                        return eval_op1 < eval_op2;
                    case "<=":
                        return eval_op1 <= eval_op2;
                    case "==":
                        return eval_op1 == eval_op2;
                    case "===":
                        return eval_op1 === eval_op2;
                    case "!=":
                        return eval_op1 != eval_op2;
                    case "!==":
                        return eval_op1 !== eval_op2;
                }

            } else {
                if (this.has_operator) {
                    // the only unary operator is logical negation ('!')
                    return !Boolean(eval_op1);
                } else {
                    return Boolean(eval_op1);
                }
            }

        };

        return ConditionDirective;
    }
);