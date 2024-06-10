// JavaScript to toggle sub-bars visibility
document.querySelectorAll('.dropdown-btn').forEach(function(button) {
    button.addEventListener('click', function() {
        var subBars = this.parentElement.nextElementSibling; // Get the corresponding sub-bars
        subBars.classList.toggle('active'); // Toggle the active class of the sub-bars
        subBars.style.display = subBars.classList.contains('active') ? 'block' : 'none'; // Set the display property based on the active class
        this.classList.toggle('active'); // Toggle the active class of the button
    });
});