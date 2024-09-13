let signup = document.querySelector('.signup')
signup.innerHTML = ` <!-- SIGNUP -->
      <div id="my_signup" class="signup">
        <div class="container">
            <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">
                <i class="bi bi-x-lg align-items-center"></i>
            </a>
    
            <div class="col-lg-12 d-flex justify-content-center m-3">
                <img id="signup-logo-web" src="../assets/images/Logo.png" alt="">
            </div>
    
            <div class="col-lg-12 d-flex justify-content-center">
                <h2 class="text-center">Create an EzFile account now</h2>
            </div>
    
            <div class="col-lg-12 d-flex justify-content-center m-3">
                <form>
                    <!-- Email input -->
                    <div class="mb-3">
                        <div class="input">
                            <i class="bi bi-envelope-fill" id="login-icon"></i>
                            <input type="email" class="form-control" placeholder="Email address">
                        </div>
                    </div>
                    
                    <!-- Username input -->
                    <div class="mb-3">
                        <div class="input">
                            <i class="bi bi-person-fill" id="login-icon"></i>
                            <input type="text" class="form-control" placeholder="User name">
                        </div>
                    </div>
                    
                    <!-- Password input -->
                    <div class="mb-3">
                        <div class="input">
                            <i class="bi bi-lock-fill" id="login-icon"></i>
                            <input type="password" class="form-control" placeholder="Password" id="password-input">
                            <i class="bi bi-eye-slash" id="toggle-password"></i>
                        </div>
                    </div>
                    
                    <!-- Confirm Password input -->
                    <div class="mb-3">
                        <div class="input">
                            <i class="bi bi-check-circle-fill" id="login-icon"></i>
                            <input type="password" class="form-control" placeholder="Confirm Password" id="confirm-password-input">
                            <i class="bi bi-eye-slash" id="toggle-confirm-password"></i>
                        </div>
                    </div>
                    
                    <!-- Login prompt -->
                    <div class="d-flex justify-content-center">
                        <p class="signup-p me-1">Do you already have an account?</p>
                        <a style="color: #C754A8;" href="#mySidepanel2">Login here</a>
                    </div>
                    
                    <!-- Signup button -->
                    <div class="d-flex justify-content-center">
                        <button type="submit" class="btn-signup">Signup</button>
                    </div>
                </form>
            </div>
        </div>
    </div>`


      // JavaScript to toggle password visibility
const togglePassword = document.querySelector('#toggle-password');
const passwordInput = document.querySelector('#password-input');

togglePassword.addEventListener('click', function () {
    // Toggle the type attribute
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle the eye slash icon
    this.classList.toggle('bi-eye');
});

// JavaScript to toggle confirm password visibility
const toggleConfirmPassword = document.querySelector('#toggle-confirm-password');
const confirmPasswordInput = document.querySelector('#confirm-password-input');

toggleConfirmPassword.addEventListener('click', function () {
    // Toggle the type attribute
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);
    
    // Toggle the eye slash icon
    this.classList.toggle('bi-eye');
});





$(document).ready(function() {
    // Hàm để cập nhật chiều rộng của các giao diện
    function updatePanelWidth() {
        var screenWidth = $(window).width();
        var panelWidth = (screenWidth < 992) ? '100%' : '90%';

        $('#my_signup').css('width', '0'); // Ẩn giao diện đăng ký
        $('#my_login').css('width', panelWidth); // Cập nhật chiều rộng của giao diện đăng nhập
    }

    // Hiển thị giao diện đăng nhập và lớp phủ khi nhấp vào liên kết "Login here"
    $('a[href="#mySidepanel2"]').click(function(e) {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết

        // Cập nhật chiều rộng của giao diện đăng nhập dựa trên kích thước màn hình
        updatePanelWidth();
        $('#my_signup').css('width', '0'); // Ẩn giao diện đăng ký
        $('.overlay').show(); // Hiển thị lớp phủ
    });

    // Ẩn các giao diện và lớp phủ khi lớp phủ được nhấp
    $('.overlay').click(function() {
        $('#my_signup').css('width', '0'); // Ẩn giao diện đăng ký
        $('#my_login').css('width', '0'); // Ẩn giao diện đăng nhập
        $('.overlay').hide(); // Ẩn lớp phủ
    });

    // Cập nhật chiều rộng của các giao diện khi cửa sổ thay đổi kích thước
    $(window).resize(function() {
        if ($('#my_login').css('width') === '90%' || $('#my_login').css('width') === '100%') {
            updatePanelWidth();
        }
    });
});
