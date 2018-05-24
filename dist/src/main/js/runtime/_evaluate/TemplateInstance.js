define(
    /* Class name */
    'main/runtime/_evaluate/TemplateInstance',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/api/unit/UnitInstance'],

    /* Class symbols */
    function (assert, lodash, UnitInstance) {

        'use strict';

        /**
         * @class A template instance.
         *
         * @param {!UnitInstance} root_unit_instance - the root unit instance.
         */
        function TemplateInstance(root_unit_instance) {
            //assert(root_unit_instance instanceof UnitInstance);
            this.root_unit_instance = root_unit_instance;
        }

        return TemplateInstance;
    }
);