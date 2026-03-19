// Sidebar Toggle Logic
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function () {
        const submenu = this.nextElementSibling;
        if (submenu && submenu.classList.contains('submenu')) {
            // Check if this item is already open
            const isOpen = this.classList.contains('open');

            // Close all other nav-items
            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('open');
            });

            // Toggle current one based on previous state
            if (!isOpen) {
                this.classList.add('open');
            }
        }
    });
});
