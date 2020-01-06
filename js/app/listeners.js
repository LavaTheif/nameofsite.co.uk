let debug = false;
$(document).ready(function (){
    loadData();

    $('#board').on('change', updateSidebarView);
    $('#filter').on('change', updateSidebarFilter);


    $(document).keyup(function (e) {
        let code = (e.keyCode ? e.keyCode : e.which);
        delete currentKeys[code];
        evaluatedKeys.splice(evaluatedKeys.indexOf(code), 1)
    });
    $(document).keydown(function (e) {
        let code = (e.keyCode ? e.keyCode : e.which);
        currentKeys[code] = e;
    });

    $(document).bind('click', closeContext);

    document.onmousemove = function (e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
    };

    if(debug)
        setInterval(function(){console.log(currentKeys)}, 10)
});
