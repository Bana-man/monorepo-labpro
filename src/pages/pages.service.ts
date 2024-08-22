import { Injectable } from '@nestjs/common';

@Injectable()
export class PagesService {
    // Generate the navbar HTML
    createNavbar(isAuthenticated: boolean): string {
        return `
            <nav class="bg-blue-500 p-4">
                <div class="container mx-auto flex justify-between items-center">
                    <input id="filmSearch" type="text" placeholder="Search Film" class="p-2 rounded-lg w-full md:w-1/2 lg:w-1/3">
                    <button id="authBtn" class="ml-4 p-2 bg-${isAuthenticated ? 'red' : 'green'}-500 text-white rounded-md">
                        ${isAuthenticated ? 'Logout' : 'Login'}
                    </button>
                </div>
            </nav>
        `;
    }

    // Generate a film card HTML
    createFilmCard(film): string {
        return `
            <div class="bg-white rounded-lg shadow-lg p-4">
                <img src="${film.cover_image_url || 'https://via.placeholder.com/150'}" alt="Film Cover" class="w-full h-48 object-cover rounded">
                <h3 class="text-lg font-semibold mt-4">${film.title}</h3>
                <p class="text-sm text-gray-600">Director: ${film.director}</p>
                <button class="mt-4 bg-indigo-600 text-white p-2 rounded-md w-full" onclick="viewDetails('${film.id}')">Detail</button>
            </div>
        `;
    }

    // Generate the pagination buttons HTML
    createPaginationButtons(currentPage: number, totalPages: number): string {
        return `
            <div id="paginationControls" class="mt-8 flex justify-center space-x-2">
                <button id="prevPage" class="bg-gray-200 text-gray-700 p-2 rounded-md" ${currentPage <= 1 ? 'disabled' : ''}>Previous</button>
                <button id="nextPage" class="bg-gray-200 text-gray-700 p-2 rounded-md" ${currentPage >= totalPages ? 'disabled' : ''}>Next</button>
            </div>
        `;
    }

    createLoginForm() {
        return `
            <div class="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
                <form id="loginForm">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">Username</label>
                        <input id="username" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
                        <input id="password" type="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" required>
                    </div>
                    <div class="flex items-center justify-between">
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Login</button>
                        <a href="/register" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Register</a>
                    </div>
                </form>
            </div>
        `
    }

    createRegisterForm() {
        return `
            <div class="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
                <form id="registerForm">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">Username</label>
                        <input id="username" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
                        <input id="email" type="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
                        <input id="password" type="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" required>
                    </div>
                    <div class="flex items-center justify-between">
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Register</button>
                        <a href="/login" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Login</a>
                    </div>
                </form>
          </div>
        `
    }

    createBrowsePage(isAuthenticated: boolean, films: any[], currentPage: number, totalPages: number): string {
        const navbar = this.createNavbar(isAuthenticated);
        const filmCards = films.map(film => this.createFilmCard(film)).join('');
        const pagination = this.createPaginationButtons(currentPage, totalPages);

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Browse Films</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="bg-gray-100">
            ${navbar}
            <div id="app" class="container mx-auto p-8">
                <div id="filmsContainer" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    ${filmCards}
                </div>
                ${pagination}
            </div>
            <script src="/dashboard.js"></script>
        </body>
        </html>
        `;
    }

    createLoginPage() {
        const loginForm = this.createLoginForm();
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Browse Films</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body class="bg-gray-100">
                ${loginForm}
                <script src="/login.js"></script>
            </body>
            </html>
        `
    }

    createRegisterPage() {
        const registerForm = this.createRegisterForm();
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Browse Films</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body class="bg-gray-100">
                ${registerForm}
                <script src="/register.js"></script>
            </body>
            </html>
        `
    }
}
