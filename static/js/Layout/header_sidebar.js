

// TẠO 1 KHỐI HTML SIDEBAR
let sidebar = document.querySelector('.sidebar')
sidebar.innerHTML = ` 
                <div class="d-flex justify-content-center">
                  <img id="logo" src="/static/images/Logo.png"  alt="">
                </div>
               <div class="list-group list-group-flush">
                    <a class="list-group-item list-group-item-action list-group-item-light p-3" href="/">
                      <i class="bi bi-house-door-fill"></i>
                      Home
                    </a>
                    <a class="list-group-item list-group-item-action list-group-item-light p-3" href="/listfiles/">
                      <i class="bi bi-file-earmark-bar-graph-fill"></i>
                      Projects
                    </a>
                    <a class="list-group-item list-group-item-action list-group-item-light p-3" href="/account/profile/">
                      <i class="bi bi-person-lines-fill"></i>
                      Account
                    </a>
                    <a class="list-group-item list-group-item-action list-group-item-light p-3" href="/trash">
                      <i class="bi bi-trash-fill"></i>
                      Trash
                    </a>                 
                </div>
            `


// TẠO 1 KHỐI TOP-NAV BẰNG HTML    
let topnav = document.querySelector('.topnav-after-login')
topnav.innerHTML = ` 
                    <nav class="navbar navbar-expand-lg shadow p-3">
                        <div class="container-fluid">
                          <i class="bi bi-list" id="sidebarToggle"></i>
                          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                          </button>
                          <div class="collapse navbar-collapse " id="navbarSupportedContent">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                              <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                  Tools
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-lg-start">
                                    <li><button class="dropdown-item" type="button"><img class="tools-icon" src="/static/images/arrangeicon.png" alt="">Arrange PDF files</button></li>
                                    <li><button class="dropdown-item" type="button"><img class="tools-icon" src="/static/images/editicon.png" alt="">View & Edit PDF</button></li>
                                    <li><button class="dropdown-item" type="button"><img class="tools-icon" src="/static/images/converticon.png" alt="">PDF conversion</button></li>
                                    <li><button class="dropdown-item" type="button"><img class="tools-icon" src="/static/images/drawicon.png" alt="">Sign</button></li>
                                  </ul>
                              </li>
                            </ul>
                            <ul class="navbar-nav  mb-2 mb-lg-0">
                              <li class="nav-item dropdown">
                                <a class="nav-link " href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Personal
                                    <i class="bi bi-person-circle"></i>                                  
                                </a>
                                <ul class="dropdown-menu">
                                  <li>
                                    <div class=" d-flex flex-column justify-content-center align-items-center">
                                      <div class="avatar-user d-flex flex-column justify-content-center align-items-center">
                                        <span style="font-size: 1.5rem; color: white;">AL</span>
                                      </div>
                                      <span>User name</span>
                                    </div>
                                  </li>
                                  <li><hr class="dropdown-divider"></li>
                                  <li><a class="dropdown-item" href="#"><i class="bi bi-person-fill me-2"></i>Account </a></li>
                                  <li><hr class="dropdown-divider"></li>
                                  <li><a class="dropdown-item" href="#"><i class="bi bi-box-arrow-left me-2"></i>Logout</a></li>
                                </ul>
                              </li>
                            </ul>



                            <img class="ms-3" src="/static/images/EzPDF.jpg" style="height: 3rem; width: 4rem;" alt="">
                          </div>
                        </div>
                      </nav>
                ` 






// TEMPLETE CODE

{/* <div class="d-flex" id="wrapper">
<!-- Sidebar-->
<div class=" border-end sidebar" id="sidebar-wrapper"></div>

<!-- Page content wrapper-->
<div id="page-content-wrapper">

    <!-- Top navigation-->
    <div class="topnav-after-login"></div>

    <!-- Page content-->
    <div class="container-fluid pt-5 mb-5">
          CONTENT
    </div>
</div> */}




// LINK  
/*<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link href="../assets/css/api_boostrap_v5.2.3.css" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/header_and_sidebar_afterlogin.css">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../Layout/header_and_sidebar_afterlogin.js"></script>
  <script src="../Layout/toggle.js"></script> */