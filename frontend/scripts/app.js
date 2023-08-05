//  feature container pop up

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

// hamburger menu

const hamburgerMenu = document.querySelector('.hamburger-menu-container');
const headerNav = document.querySelector('.header-nav');
const ham = document.querySelector('.ham');
const hamRotate = document.querySelector('.hamRotate');
const headerLink = document.querySelectorAll('.header-link');

let menuOpen = false;

headerLink.forEach(link => {
    link.addEventListener('click', () => {
        headerNav.classList.remove('active');
        ham.classList.remove('active');
        hamRotate.classList.remove('active');
        menuOpen = false;
    })
})

hamburgerMenu.addEventListener('click', () => {
    if (!menuOpen) {
        headerNav.classList.add('active');
        ham.classList.add('active');
        hamRotate.classList.add('active');
        menuOpen = true;

    } else {
        headerNav.classList.remove('active');
        ham.classList.remove('active');
        hamRotate.classList.remove('active');
        menuOpen = false;
    }
})

// form submission
document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = {
    username: form.username.value,
    password: form.password.value,
  }

  try {
    const response = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // If the response is successful (status code 2xx),
      // display a success message
      document.getElementById('message').textContent = 'Sign up successful! Please log in.';
      form.reset();

      // Optionally, you can redirect to the login page after successful sign-up
    //   window.location.href = 'http://localhost:3000/login';
    } else {
      // If the response is not successful (status code not 2xx),
      // display an error message
      document.getElementById('message').textContent = 'Sign up failed. Please try again.';
    }
  } catch (error) {
    // If there's an error with the request (e.g., network issue),
    // display an error message
    document.getElementById('message').textContent = 'An error occurred. Please try again later.';
  }
});


