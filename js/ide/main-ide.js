requirejs(['require-config'], function() {
    requirejs(['Forward', 'main/api/diff/UpdateDiff', 'main/api/diff/AppendDiff', 'main/api/diff/InsertIntoArrayDiff',
        'main/api/diff/Path'],
        function(Forward, UpdateDiff, AppendDiff, InsertIntoArrayDiff, Path) {
        // console.log('loading!');
        // Forward.display('js/demos/first-demo-before/template.fwd', 'myID');

            var template_editor = ace.edit("template");
            var action_editor = ace.edit("action");
            var html_editor = ace.edit("html");

            // template_editor.session.setMode("ace/mode/html");
            // template_editor.getSession().setUseWorker(false);
            var content = template_editor.getValue();
            var action_content = action_editor.getValue();
            console.log(action_content);
            var html_content = html_editor.getValue();
            var myIDElem = document.getElementById("runPane");
            myIDElem.innerHTML = html_content;

            var template = action_editor.getValue();
            eval(template);



            console.log(content);
            //Forward._display_template(content, {}, 'myID');
            $('#run-button').click( function(e) {
                // parse html tab content and set to the bottom pane
                var html_content = html_editor.getValue();
                var myIDElem = document.getElementById("runPane");
                myIDElem.innerHTML = html_content;

                // get javascript action and evaluate it
                var template = action_editor.getValue();

                e.preventDefault();
                var content = template_editor.getValue();
                /*your_code_here;*/
                document.getElementById("myID").innerHTML = "";
                eval(template);
                return false; } );

    });


});
