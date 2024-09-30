let login = document.querySelector('.login')
login.innerHTML = ` 
     <div id="my_login" class="login">
            <div class="container">
              <a href="javascript:void(0)" class="closebtn2" onclick="closeNav2()">
                <i class="bi bi-x-lg align-items-center"></i>
              </a>
    
                <div class="col-lg-12 d-flex justify-content-center m-3">
                  <img id="signup-logo-web" src="../assets/images/Logo.png" alt="">
                </div>
    
                <div class="col-lg-12 d-flex justify-content-center" >
                  <h2 class="text-center">EzPDF Login</h2>
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
    
                     <!-- Password input -->
                     <div class="mb-3">
                      <div class="input">
                          <i class="bi bi-lock-fill" id="login-icon"></i>
                          <input type="password" class="form-control" placeholder="Password" id="login-password-input">
                          <i class="bi bi-eye-slash" id="toggle-login-password"></i>                  
                      </div>
                  </div> 
    
                    <!-- Login prompt -->
                    <div class="d-flex justify-content-center">
                        <p class="signup-p me-1"> Do not have an account?</p>
                        <a style="color: #C754A8;" href="#mySidepanel">Signup here</a>
                    </div>
    
                    <!-- Login button -->
                    <div class="d-flex justify-content-center">
                      <button type="submit" class="btn-signup">Login</button>
                    </div>
    
                  </form>
                </div>
              </div>
          </div>
      `
 // JavaScript to toggle password visibility for login form
 const toggleLoginPassword = document.querySelector('#toggle-login-password');
 const loginPasswordInput = document.querySelector('#login-password-input');
 
 toggleLoginPassword.addEventListener('click', function () {
     const type = loginPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
     loginPasswordInput.setAttribute('type', type);
     this.classList.toggle('bi-eye');
 });





//  Hàm chuyển đổi từ login --> signup
 $(document).ready(function() {
  // Hàm để cập nhật chiều rộng của các giao diện
  function updatePanelWidth() {
      var screenWidth = $(window).width();
      var panelWidth = (screenWidth < 992) ? '100%' : '90%';

      // Cập nhật chiều rộng của giao diện đăng ký khi hiển thị
      $('#my_signup').css('width', panelWidth);
      // Cập nhật chiều rộng của giao diện đăng nhập khi hiển thị
      $('#my_login').css('width', '0');
  }

  // Hiển thị giao diện đăng ký và lớp phủ khi nhấp vào liên kết "Signup here"
  $('a[href="#mySidepanel"]').click(function(e) {
      e.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết

      // Cập nhật chiều rộng của giao diện đăng ký dựa trên kích thước màn hình
      updatePanelWidth();
      $('#my_login').css('width', '0'); // Ẩn giao diện đăng nhập
      $('.overlay').show(); // Hiển thị lớp phủ
  });

  // Hiển thị giao diện đăng nhập và lớp phủ khi nhấp vào liên kết "Login here"
  $('a[href="#mySidepanel2"]').click(function(e) {
      e.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết

      // Cập nhật chiều rộng của giao diện đăng nhập dựa trên kích thước màn hình
      var screenWidth = $(window).width();
      var panelWidth = (screenWidth < 971) ? '100%' : '90%';
      
      $('#my_signup').css('width', '0'); // Ẩn giao diện đăng ký
      $('#my_login').css('width', panelWidth); // Hiển thị giao diện đăng nhập
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
      // Nếu giao diện đang hiển thị, cập nhật lại chiều rộng
      if ($('#my_signup').css('width') === '90%' || $('#my_signup').css('width') === '100%') {
          updatePanelWidth();
      }
      if ($('#my_login').css('width') === '90%' || $('#my_login').css('width') === '100%') {
          var screenWidth = $(window).width();
          var panelWidth = (screenWidth < 971) ? '100%' : '90%';
          $('#my_login').css('width', panelWidth);
      }
  });
});
