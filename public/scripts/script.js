$(function() {
        $('#login-form-link').click(function(e) {
            $("#login-form").show(100);
             $("#register-form").hide(100);
            $('#register-form-link').removeClass('active');
            $(this).addClass('active');
            e.preventDefault();
        });
        $('#register-form-link').click(function(e) {
            $("#register-form").show(100);
             $("#login-form").hide(100);
            $('#login-form-link').removeClass('active');
            $(this).addClass('active');
            e.preventDefault();
        });    
});

function login 
    