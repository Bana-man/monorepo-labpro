const token = localStorage.getItem('Authorization');
const filmId = localStorage.getItem('selectedFilm');
const user = parseJwt(token);

const watchButton = document.getElementById('watch-btn');
const buyButton = document.getElementById('buy-btn');
const statusElement = document.getElementById('status');
const videoSource = document.getElementById('video-source');
const imageSource = document.getElementById('image-source');

const titleText = document.getElementById('titleText');
const directorText = document.getElementById('directorText');
const yearText = document.getElementById('yearText');
const genreText = document.getElementById('genreText');
const priceText = document.getElementById('priceText');
const descText = document.getElementById('descText');

// Elements
const videoModal = document.getElementById('video-modal');
const closeModal = document.getElementById('close-modal');
const body = document.body;

// Show modal on button click
watchButton.addEventListener('click', () => {
    videoModal.classList.remove('hidden');
    body.classList.add('overflow-hidden');
});

// Close modal on close button click
closeModal.addEventListener('click', () => {
    videoModal.classList.add('hidden');
    body.classList.remove('overflow-hidden');
});

// Close modal when clicking outside the modal content
videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal || e.target === videoModal.querySelector('.modal-bg')) {
        videoModal.classList.add('hidden');
        body.classList.remove('overflow-hidden');
    }
});

// Parse JWT token to get user role
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(base64);
    } catch (e) {
        return null;
    }
}

// Mengecek apakah user telah membeli film
function hasUserPurchasedFilm(film, userId) {
    return film.owners.some(owner => owner.id === userId);
}

async function checkFilmStatus() {
    try {
        const response = await fetch(`/films/${filmId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response);
        const result = await response.json();
        console.log(result);
        
        if (!token) {
            statusElement.textContent = 'Login to buy or watch this film.';
            buyButton.style.display = 'none';
            watchButton.style.display = 'none';
        } else if (!hasUserPurchasedFilm(result.data, user.sub)) {
            statusElement.textContent = 'Not purchased this film yet.';
            buyButton.style.display = 'block';
            watchButton.style.display = 'none';
        } else {
            statusElement.textContent = 'Already purchased this film.';
            buyButton.style.display = 'none';
            watchButton.style.display = 'block';
        }

        buyButton.addEventListener('click', () => {
            handleBuyFilm(result.data);
        });

        // Set film details
        titleText.textContent       = `${result.data.title}`
        directorText.textContent    = `Director     : ${result.data.director}`;
        yearText.textContent        = `Release Year : ${result.data.releaseYear}`;
        genreText.textContent       = `Genre        : ${result.data.genre}`;
        priceText.textContent       = `Price        : ${result.data.price}`;
        descText.textContent        = `${result.data.description}`;    
        
        imageSource.src = result.data.cover_image_url;
        videoSource.src = result.data.video_url;
    } catch (error) {
        console.error('Error fetching film status:', error);
    }
}

async function handleBuyFilm(data) {
    const entry = await fetch(`/users/${user.sub}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const result = await entry.json();
    console.log(result);

    if (result.data.balance < data.price) {
        statusElement.textContent = 'Your balance is not enough.';
    } else {
        await fetch(`/self/buy/${filmId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        
        statusElement.textContent = 'Successfully purchased this film.';
        buyButton.style.display = 'none';
        watchButton.style.display = 'block';
    }
}

// Check film status on page load
checkFilmStatus();