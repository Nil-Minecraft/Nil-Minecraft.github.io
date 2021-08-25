function myalert(str) {
    if (document.getElementById("msgbox") != null) {
        document.getElementById("msgbox").remove()
    }
    var div = '<div id="msgbox" class="mark"></div>';
    $('body').append(div);
    $('.mark').html(str);
    $('.mark').show();
    setTimeout(function () {
        $('.mark').hide();
        $('.mark').remove();
    }, 2000)
}