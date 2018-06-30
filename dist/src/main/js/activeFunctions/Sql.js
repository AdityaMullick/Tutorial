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
    'main/activeFunctions/Sql',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/api/activeFunction/ActiveFunction', 'main/api/diff/Op', 'socketio',
        'main/api/diff/AppendDiff', 'main/api/diff/Path', 'main/api/diff/UpdateDiff'],

    /* Class symbols */
    function (assert, lodash, ActiveFunction, Op, io, AppendDiff, Path, UpdateDiff) {

        'use strict';

        /**
         * @class An SQL active function.
         *
         */
        function Sql(query) {

            /* Super constructor */
            ActiveFunction.call(this);
            var current_query = query;

            this.addInitFunction(initialSql);
            this.addDeltaFunction(Op.UPDATE, 'groupby', groupby_func);
            this.addDeltaFunction(Op.UPDATE, 'notgroupby', not_groupby_func);


            function initialSql(FORWARD) {


                var socket_conn = io.connect('http://localhost:3000');

                // var socket_conn = io.connect('http://localhost:3000');
                function resolveQuery(query) {
                    socket_conn.emit('query', query);
                    socket_conn.on('result', function(msg){
                        console.log(msg);
                        // resolve(JSON.parse(msg.result));
                        var diff = new UpdateDiff(new Path('users'), JSON.parse(msg.result));
                        FORWARD.applyDiffs([diff]);
                    });
                }

                // create diffs manually.
                var i = 100;
                function createUser() {
                    i += 1;
                    return {
                        id : i,
                        lat : chance.latitude(),
                        lng : chance.longitude()
                    }
                }

                // setInterval(function() {
                //     i++;
                //     var new_user = createUser();
                //     var diff = new AppendDiff(new Path('users'), new_user);
                //     FORWARD.applyDiffs([diff]);
                // }, 1000);

                // create diffs manually.

                resolveQuery(current_query);
                return [];

                // function f1(query) {
                //     var x = await resolveQuery(query);
                //     console.log(x)
                //     return x
                // }
                // return f1('Select * from user_table');
                // return false;
                //
                //
                // // var socket_conn = io();
                // var query = 'Select * from friend';
                //
                // socket_conn.emit('query', query);
                //
                // socket_conn.on('result', function(msg){
                //     console.log(msg);
                // });
                //
                // socket_conn.on('sqlEvent', function(msg) {
                //     $('#queries').append("<li class='response'>" + msg + "</p>");
                // });

                // console.log(FORWARD);
                // var i = -1;
                // function createUser() {
                //     i += 1;
                //     return {
                //         id : i,
                //         lat : chance.latitude(),
                //         lng : chance.longitude()
                //     }
                // }
                //
                //
                // function generateUserData(n) {
                //     var arr = [];
                //     for (var j = 0; j < n; j++) {
                //         arr.push(createUser());
                //     }
                //     return arr;
                // }
                //
                //
                // var i=0;
                // var n = 10;
                // setInterval(function() {
                //     i++;
                //     var new_user = createUser();
                //     var diff = new AppendDiff(new Path('users'), new_user);
                //     FORWARD.applyDiffs([diff]);
                // }, 100);
                //
                // this.users = generateUserData(100);
                // console.log(this.users);

                return this.users;

            }

        }

        /* Super class */
        Sql.prototype = new ActiveFunction();






        function groupby_func() {
            console.log('accessing this.users', this.users);
        }




        function not_groupby_func(unit_instance, diff) {
            var unit_state = diff.getPayload();
            var id = diff.getTarget();
            var marker = unit_instance.getUiObject(id.up());
            marker.setPosition(unit_state);
        }



        return Sql;
    }
);