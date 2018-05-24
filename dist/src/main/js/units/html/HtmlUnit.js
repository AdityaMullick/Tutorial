//require.config({
//
//    paths : {
//create alias to plugins (not needed if plugins are on the baseUrl)
//async: '/bower_components/requirejs-plugins/src/async'
//async: 'https://dl.dropboxusercontent.com/u/15585964/services-online%20Docs/async'
//}
//});
define(
    /* Class name */
    'main/units/html/HtmlUnit',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/api/unit/Unit', 'main/api/diff/Op'],

    /* Class symbols */
    function (assert, lodash, Unit, Op) {

        'use strict';

        /**
         * @class A HTML unit.
         *
         */
        function HtmlUnit() {

            /* Super constructor */
            Unit.call(this);

            this.addHtmlRenderer(Op.CONSTRUCT, construct);
            this.addHtmlRenderer(Op.DESTRUCT, destruct);
            this.addHtmlRenderer(Op.DELETE, remove);
            this.addHtmlRenderer(Op.UPDATE, update);
            this.addHtmlRenderer(Op.INSERT_HTML, insert);
            this.addHtmlRenderer(Op.APPEND, append);


        }

        /* Super class */
        HtmlUnit.prototype = new Unit();

        function construct(unit_instance, diff) {
            var hook = unit_instance.container_element;
            //var temp = document.createElement('template');
            //console.log('construct payload:', diff.getPayload());
            //console.log('construct payload stripped down:', diff.getPayload().replace(/ /g,''));
            //temp.innerHTML = diff.getPayload().replace(/ /g,'');
            //temp.innerHTML = diff.getPayload();
            //var frag = temp.content;

            // payload of 'diff' is to be a DOM subtree.
            //var frag = diff.getPayload().content;
            hook.appendChild(diff.getPayload());
        }

        function append(unit_instance, diff) {

            var path_obj = diff.getTarget();
            var path_array = path_obj.steps;
            var node = retrieve_node(path_array, unit_instance.container_element);
            var temp = document.createElement('template');
            temp.innerHTML = diff.getPayload();
            var frag = temp.content;
            node.appendChild(frag);
        }

        function remove(unit_instance, diff) {
            var path_obj = diff.getTarget();
            var path_array = path_obj.steps;
            var target_node_index = path_array.slice( (path_array.length - 1), path_array.length )[0];
            var node = retrieve_node(path_array.slice( 0, (path_array.length - 1)), unit_instance.container_element);
            node.removeChild(node.childNodes[target_node_index.position]);
        }

        function update(unit_instance, diff) {
            // console.log('Visual Diff:', diff);
            var path_obj = diff.getTarget();
            var path_array = path_obj.steps;
            var node = retrieve_node(path_array, unit_instance.container_element);
            if (node.nodeType === Node.TEXT_NODE) { // it's a text node
                node.nodeValue = diff.getPayload();
            }
            else {
                node.innerHTML = diff.getPayload();
            }
        }

        function insert(unit_instance, diff) {
            var path_obj = diff.getTarget();
            var path_array = path_obj.steps;
            var node = retrieve_node(path_array, unit_instance.container_element);
            node.insertAdjacentHTML('beforebegin', diff.getPayload());
        }


        /**
         * This function navigates through the HTML document and returns the node with the given path.
         * @param path  - The path.
         * @returns {*} - The retrieved node.
         */
        function retrieve_node(path, container) {
            //var node = document.documentElement;
            var node = container;
            // console.log('path:', path);
            //path = path.slice(1);
            // console.log(node);

            for (var i = 0; i < path.length; i++) {
                var path_step = path[i];
                //var non_text_nodes = [];
                //for (var j = 0 ; j < node.childNodes.length; j++) {
                //    if (node.childNodes[j].nodeType  === 1 ) {
                //        // include only Node.ELEMENT_NODE
                //        non_text_nodes.push(node.childNodes[j]);
                //    }
                //}
                //node = non_text_nodes[path_step.position];
                if (lodash.isUndefined(node)) {
                    console.log('spotted bug');
                }
                node = node.childNodes[path_step.position];
                // console.log(node);
            }
            //console.log('found:');
            //console.log(node);
            return node;
        }

        function destruct(unit_instance, diff) {
            unit_instance.setUiObject(diff.target, null);
        }

        return HtmlUnit;
    }
);