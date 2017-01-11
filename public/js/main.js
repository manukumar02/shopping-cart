(function () {
    var url = 'https://api.myjson.com/bins/19ynm&callback=callbackFN';

    $.ajax({
        url: url,
        dataType: 'json',
        success: function(data) {
            console.log(data);
            var template = Handlebars.compile($('#template').html());
            var temp = template(data);
            $(document.body).append(temp);
            $('.edit').on('click', function() {
                overlay(data);
            })
        },
        error: function(error) {
            console.log(error);
        }
    });

    function overlay(data) {
        var template = Handlebars.compile($('#overlayModal').html());
        var temp = template(data);
        $('.overlay').append(temp);

        var modal = $('#myModal');
        var btn = $('.edit');
        var overlay = $('.overlay');

        var span = $('.close')[0];
        overlay.removeClass('hidden');

        // $(document).off().on('click','.edit', function() {
        //     overlay.removeClass('hidden');
        // });

        $(document).off().on('click', '.close',function() {
            overlay.addClass('hidden');
        });

        $(document).on('click', function(event) {
            if (event.target == modal) {
                overlay.addClass('hidden');
            }
        });
    }
})();