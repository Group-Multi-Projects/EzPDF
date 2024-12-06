let header =  document.querySelector('.header');
header.innerHTML = `  <header class="navbar navbar-expand-lg bg-body-tertiary shadow p-3 mb-5 bg-body rounded header">
            <div class="container-fluid">
              <a href="../index.html">
                <img style="margin-right: 0.5rem;" class="logo" src="../assets/images/Logo.png" alt="">
              </a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item dropdown me-3">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Tools
                    </a>
                    <ul class="dropdown-menu">
                      <li class="dropdown-item-li"><a class="dropdown-item" href="#">Arrange PDF files</a></li>
                      <li class="dropdown-item-li"><a class="dropdown-item" href="#">View & Edit PDF </a></li>
                      <li class="dropdown-item-li"><a class="dropdown-item" href="#">PDF conversion</a></li>
                      <li class="dropdown-item-li"><a class="dropdown-item" href="#">Sign</a></li>
                    </ul>
                  </li>
                  <li class="nav-item me-3">
                    <a class="nav-link" href="#">Conversion</a>
                  </li>
                  <li class="nav-item me-3">
                    <a class="nav-link" href="#">Merge</a>
                  </li>
                  <li class="nav-item me-3">
                    <a class="nav-link" href="#">Edit</a>
                  </li>
                </ul>
               
                  <span class="openbtn2" id="login__link" onclick="openNav2()">Login </span>
                  <button type="button" class="btn btn-primary openbtn" id="btn_tryfree" onclick="openNav()">Try it for free</button>
              </div>
            </div>
        </header>
   `