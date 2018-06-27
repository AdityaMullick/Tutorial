$(document).ready(function() {
    var current = 0;
    var options = ['simple', 'visual', 'dynamic', 'input', 'parameters','singleBrowse', 'multipleBrowse'];
    $("#simple").click(function() {
        document.getElementById("container").innerHTML='<object class = "elem" style="min-width:100%; min-height: 101%;" type="text/html" data="simple.htm" ></object>';
        //set the correct examples
//        var html_editor = ace.edit("html");
        window.location.href = "index.html";



        current = 0;

    });
    $("#visual").click(function() {
        document.getElementById("container").innerHTML='<object class = "elem"  style="min-width:100%; min-height: 101%;" type="text/html" data="visual.html" ></object>';
        current = 1;
        window.location.href = "visual_units.html";

    });
    $("#dynamic").click(function() {
        document.getElementById("container").innerHTML='<object class = "elem" style="min-width:100%; min-height: 101%;" type="text/html" data="dynamic.html" ></object>';
        window.location.href = "dynamic_data.html";
        current = 2;


    });
    $("#input").click(function() {
        document.getElementById("container").innerHTML='<object class = "elem" style="min-width:100%; min-height: 101%;" type="text/html" data="user-input.html" ></object>';
        current = 3;
        window.location.href = "user_input.html";


    });
    $("#parameters").click(function() {
        document.getElementById("container").innerHTML='<object class = "elem" style="min-width:100%; min-height: 101%;" type="text/html" data="dynamic.html" ></object>';
        current = 4;
        window.location.href = "url_parameters.html";

    });
    $("#singleBrowse").click(function() {
        document.getElementById("container").innerHTML='<object class = "elem" style="min-width:100%; min-height: 101%;" type="text/html" data="dynamic.html" ></object>';
        current = 5;
        window.location.href = "single_input.html";


    });
    $("#multipleBrowse").click(function() {
        document.getElementById("container").innerHTML='<object class = "elem" style="min-width:100%; min-height: 101%;" type="text/html" data="dynamic.html" ></object>';
        current = 6;
        window.location.href = "multiple_input.html";


    });
    $("#nextButton").click(function() {
        console.log(window.location.href);

        var url = window.location.href;
        if(url.indexOf("index.html") != -1) {
            document.getElementById("visual").click();

        }
        else if(url.indexOf("visual_units.html") != -1) {
            document.getElementById("dynamic").click();


        }
        else if(url.indexOf("dynamic_data.html") != -1) {
            document.getElementById("input").click();


        }
        else if(url.indexOf("user_input.html") != -1) {
            document.getElementById("parameters").click();


        }
        else if(url.indexOf("url_parameters.html") != -1) {
            document.getElementById("singleBrowse").click();

        }
        else if(url.indexOf("single_input.html") != -1) {
            document.getElementById("multipleBrowse").click();


        }


        /*if(current < options.length - 1) {
            var file = options[current + 1];
            console.log(current);
            console.log(file);
            document.getElementById(file).click();
            current++;
        }*/

    });
    $("#previous").click(function() {
        console.log(window.location.href);

        var url = window.location.href;
        if(url.indexOf("visual_units.html") != -1) {
            document.getElementById("simple").click();

        }
        else if(url.indexOf("dynamic_data.html") != -1) {
            document.getElementById("visual").click();


        }
        else if(url.indexOf("user_input.html") != -1) {
            document.getElementById("dynamic").click();


        }
        else if(url.indexOf("url_parameters.html") != -1) {
            document.getElementById("input").click();


        }
        else if(url.indexOf("single_input.html") != -1) {
            document.getElementById("parameters").click();

        }
        else if(url.indexOf("multiple_input.html") != -1) {
            document.getElementById("singleBrowse").click();


        }


        });
});
