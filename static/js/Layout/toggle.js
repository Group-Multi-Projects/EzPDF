
// HIỆU ỨNG NÚT MENU BÊN TRÁI CỦA TOP-NAV 
window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            
            // Toggle the class that controls the icon change
            
            sidebarToggle.classList.toggle('bi-text-indent-left');
            sidebarToggle.classList.toggle('bi-list');
            // Add smooth rotation effect
            sidebarToggle.classList.toggle('rotate');
  
            // Toggle the sidebar
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }
  
  });
