document.querySelectorAll('.project-bt').forEach(button => {
    button.addEventListener('click', () => {
        const dropdownContent = button.nextElementSibling;
        if (dropdownContent.style.display === 'flex') {
            dropdownContent.style.display = 'none';
            button.classList.remove('active');
        } else {
            dropdownContent.style.display = 'flex';
            button.classList.add('active');
        }
    });
});