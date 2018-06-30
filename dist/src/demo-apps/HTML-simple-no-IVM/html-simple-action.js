requirejs(['require-config'], function() {
    requirejs(['Forward', 'main/api/diff/AppendDiff', 'main/api/diff/Path'], function(Forward, AppendDiff, Path) {
        Forward.display('demoapps/HTML-simple-no-IVM/html-simple.fwd', 'myID');
    });
});
