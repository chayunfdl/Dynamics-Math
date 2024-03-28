+ function ($) {
  $('.palceholder').click(function () {
    $(this).siblings('input').focus();
  });

  $('.form-control').focus(function () {
    $(this).parent().addClass("focused");
  });

  $('.form-control').blur(function () {
    var $this = $(this);
    if ($this.val().length == 0)
      $(this).parent().removeClass("focused");
  });
  $('.form-control').blur();

  // validetion
  $.validator.setDefaults({
    errorElement: 'span',
    errorClass: 'validate-tooltip'
  });

  $("#formvalidate").validate({
    rules: {
      userName: {
        required: true,
        minlength: 6
      },
      userPassword: {
        required: true,
        minlength: 6
      }
    },
    messages: {
      userName: {
        required: "Please enter your email.",
        minlength: "Please provide valid email."
      },
      userPassword: {
        required: "Enter your password to Login.",
        minlength: "Incorrect login or password."
      }
    }
  });

  //fetch API
  function loginUser(email, password) {
    fetch('https://be-dynamics-math-production.up.railway.app/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Handle login success
      console.log(data);
    })
    .catch(error => {
      // Handle errors
      console.error('There was a problem with the fetch operation:', error);
    });
  }

  // event listener for form submission
  $('#formvalidate').submit(function(event) {
    event.preventDefault(); // Prevent default form submission
    var email = $('#userName').val();
    var password = $('#userPassword').val();
    loginUser(email, password); // Call the login function with email and password
  });

}(jQuery);

//$(document).ready(function () {
//  var emailInput = $('#userEmail');
//  var passwordInput = $('#userPassword');

//  emailInput.focus(function () {
//    $(this).parent('.input-group').addClass('focused');
//  });
//  passwordInput.focus(function () {
//    $(this).parent('.input-group').addClass('focused');
//  });

//  emailInput.blur(function () {
//    $(this).parent('.input-group').removeClass('focused');
//  });
//  passwordInput.blur(function () {
//    $(this).parent('.input-group').removeClass('focused');
//  });
//});

function togglePasswordVisibility() {
  var passwordInput = document.getElementById("userPassword");
  var toggleIcon = document.querySelector(".toggle-password");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.classList.remove("bi-eye");
    toggleIcon.classList.add("bi-eye-slash");
  } else {
    passwordInput.type = "password";
    toggleIcon.classList.remove("bi-eye-slash");
    toggleIcon.classList.add("bi-eye");
  }
}

