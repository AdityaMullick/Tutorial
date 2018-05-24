requirejs(['require-config'], function() {
    requirejs(['Forward', 'main/api/diff/UpdateDiff', 'main/api/diff/AppendDiff', 'main/api/diff/InsertIntoArrayDiff',
        'main/api/diff/Path'],
        function(Forward, UpdateDiff, AppendDiff, InsertIntoArrayDiff, Path) {
        // console.log('loading!');
        // Forward.display('js/demos/first-demo-before/template.fwd', 'myID');

            var template_editor = ace.edit("template");
            // template_editor.session.setMode("ace/mode/html");
            // template_editor.getSession().setUseWorker(false);
            var content = template_editor.getValue();
            console.log(content);
            Forward._display_template(content, {}, 'myID');
            $('#run-button').click( function(e) {
                e.preventDefault();
                var content = template_editor.getValue();
                /*your_code_here;*/
                Forward._display_template(content, {}, 'myID');
                return false; } );

    });
});
