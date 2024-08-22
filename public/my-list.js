const filmSearch = document.getElementById('filmSearch');
const filmsContainer = document.getElementById('filmsContainer');
const paginationControls = document.getElementById('paginationControls');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const authBtn = document.getElementById('authBtn');
const userBalance = document.getElementById('userBalance');

let currentPage = 0;
const itemsPerPage = 8;
const token = localStorage.getItem('Authorization');
const balance = localStorage.getItem('balance');
const user = parseJwt(token);

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

// Fetch and display films
async function fetchAndDisplayFilms(query = '', page = 0) {
    const response = await fetch(`/self/my-film?q=${query}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
         },
    });
    
    if (!response.ok) {
        filmsContainer.innerHTML = '<p class="text-center text-red-500">Failed to load films.</p>';
    }
    
    // Check if already login or not
    if (user?.role === 'USER') {
        authBtn.textContent = 'Logout';
        authBtn.onclick = () => {
            localStorage.removeItem('Authorization');
            localStorage.removeItem('balance');
            window.location.href = '/login';
        };
        userBalance.textContent = `Balance: ${balance}`;
    } else {
        authBtn.textContent = 'Login';
        authBtn.onclick = () => {
            window.location.href = '/login';
        };
    }

    const result = await response.json();
    if (result.status === 'success') {
        const start = itemsPerPage * page;
        const end = Math.min(itemsPerPage * (page + 1), result.data.length);
        const tempData = result.data.slice(start, end);
        displayFilms(tempData);
        updatePagination(result.data.length);
    } else {
        console.error('Error fetching films:', result.message);
    }
}

// Display films as cards
function displayFilms(films) {
    filmsContainer.innerHTML = ''; // Clear previous films

    films.forEach(film => {
        const filmCard = document.createElement('div');

        filmCard.classList.add('bg-white', 'rounded-lg', 'shadow-lg', 'p-4');
        filmCard.innerHTML = `
            <img src="${film.cover_image_url}" alt="Film Cover" class="w-full h-48 object-cover rounded">
            <h3 class="text-lg font-semibold mt-4">${film.title}</h3>
            <p class="text-sm text-gray-600">Director: ${film.director}</p>
            <p class="text-sm text-gray-600">Price: ${film.price}</p>
            <button class="mt-4 bg-indigo-600 text-white p-2 rounded-md w-full" onclick="viewDetails('${film.id}')">Detail</button>
        `;

        filmsContainer.appendChild(filmCard);
    });
}

// Update pagination controls
function updatePagination(itemsCount) {
    paginationControls.style.display = itemsCount < itemsPerPage ? 'none' : 'flex';
    prevPageBtn.style.display = currentPage == 0 ? 'none' : 'block';
    nextPageBtn.style.display = currentPage > (itemsCount/itemsPerPage) - 1 ? 'none' : 'block'
}

// View details of a film
function viewDetails(filmId) {
    localStorage.setItem('selectedFilm', filmId);
    window.location.href = `/details`;
}

// Handle film search
filmSearch.addEventListener('input', () => {
    fetchAndDisplayFilms(filmSearch.value, 0); // Reset to page 0 on new search
});

// Handle pagination
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        fetchAndDisplayFilms(filmSearch.value, currentPage);
    }
});

nextPageBtn.addEventListener('click', () => {
    currentPage++;
    fetchAndDisplayFilms(filmSearch.value, currentPage);
});

// Initial setup
fetchAndDisplayFilms();