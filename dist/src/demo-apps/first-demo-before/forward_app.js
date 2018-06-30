requirejs(['require-config'], function() {
    requirejs(['Forward', 'main/api/diff/UpdateDiff', 'main/api/diff/AppendDiff', 'main/api/diff/InsertIntoArrayDiff', 'main/api/diff/Path'], function(Forward, UpdateDiff, AppendDiff, InsertIntoArrayDiff, Path) {

        Forward.display('demoapps/first-demo-before/template.fwd', 'myID');
    });
});
