const featureContainer = document.querySelectorAll('.feature-container');

featureContainer.forEach((container) => {
    container.addEventListener('mouseover', () => {
        container.classList.add('active');
    })
    container.addEventListener('mouseout', (e) => {
        container.classList.remove('active');
        console.log(e.target);
    })
})

const backgroundCover = document.querySelectorAll('.background-cover');

backgroundCover.forEach((cover) => {
    cover.addEventListener('mouseover', () => {
        cover.classList.add('active');
    })
    cover.addEventListener('mouseout', () => {
        cover.classList.remove('active');
    })
})

