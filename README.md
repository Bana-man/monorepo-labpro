## Identitas

Ahmad Hasan Albana : 13522041
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## How To Run

```bash
# build docker images
$ docker-compose build

# run all containers
$ docker-compose up -d
```

Website dapat diakses pada http://localhost:3000

## Design Pattern
### Repository Pattern
Memisahkan logika akses data (service) dan logika bisnis (controller) agar kode lebih bersih dan tidak perlu melihat isi data secara langsung saat menjalankan logika bisnis
### Service Pattern
Memisahkan logika-logika bisnis (controller) ke dalam kelas-kelas terpisah agar lebih memudahkan untuk melakukan debugging terhadap proses tertentu.
### Factory Pattern
Membuat template untuk membuat response yang direturn dari API agar memudahkan pembacaan kode dan pembuatan objek untuk di-return

## Technology Stack
- NestJS (10.0.0)
- Multer (1.4.11)
- Tailwind CSS (2.2.19)
- Redis (7.0.5)
- PostgreSQL (16.4)
- Prisma (5.18.0)
- Argon2 (0.40.3)

## Endpoint
- Register
  Request Method: POST ('/register')
  Body: {
    email: string, 
    username: string,
    firstName: string,
    lastName: string,
    password: string
  }

- Login
  Request Method: POST ('/login')
  Body: {
    username: string,
    password: string
  }

- Create Film
  Request Method: POST ('/films')
  Header: {
    Authorization: 'Bearer <token>'
  }
  Body: {
    title: string
    description: string
    director: string
    release_year: number
    genre: string[]
    price: number
    duration: number
    video: <binary video file>
    cover_image: <binary image file> | null
  }

- Search Film
  Request Method: GET ('/films')
  Header: {
    Authorization: 'Bearer <token>'
  }
  Query: {
    q: string
  }

- Get Film
  Request Method: GET ('/films/:id')
  Header: {
    Authorization: 'Bearer <token>'
  }

- Update Film
  Request Method: PUT ('/films/:id')
  Header: {
    Authorization: 'Bearer <token>'
  }
  Body: {
    title: string
    description: string
    director: string
    release_year: number
    genre: string[]
    price: number
    duration: number
    video: <binary video file> | null
    cover_image: <binary image file> | null
  }

- Delete Film
  Request Method: DELETE ('/films/:id')
  Header: {
    Authorization: 'Bearer <token>'
  }

- Get Self
  Request Method: GET ('/self')
  Header: {
    Authorization: 'Bearer <token>'
  }

- Get Self Balance
  Request Method: GET ('/self/balance')
  Header: {
    Authorization: 'Bearer <token>'
  }

- Buy Film
  Request Method: PUT ('/self/buy/:id')
  Header: {
    Authorization: 'Bearer <token>'
  }

- Get Bought Film
  Request Method: GET ('/self/my-film')
  Header: {
    Authorization: 'Bearer <token>'
  }
  Query: {
    q: string
  }

- Search User
  Request Method: GET ('/users')
  Header: {
    Authorization: 'Bearer <token>'
  }
  Query: {
    q: string
  }

- Get User
  Request Method: GET ('/users/:id')
  Header: {
    Authorization: 'Bearer <token>'
  }

- Edit Balance
  Request Method: POST ('/users/:id/balance')
  Header: {
    Authorization: 'Bearer <token>'
  }
  Body: {
    increment: number
  }

- Delete User
  Request Method: DELETE ('/users/:id')
  Header: {
    Authorization: 'Bearer <token>'
  }

## BONUS - B04 Caching
Caching (TTL: 10000ms) diimplementasikan pada endpoint berikut:
- Get User ( KEY: 'user:<userId> )
- Get Film ( KEY: 'film:<filmId> )
- Search User ( KEY: 'users' ) *hanya untuk q:null
- Search Film ( KEY: 'films' ) *hanya untuk q:null
- Get Bought Film ( KEY: 'my-film' ) *hanya untuk q:null

## BONUS - B06 Responsive Layout
Komponen yang dibuat responsive adalah:
- Input field ( lebar menyesuaikan lebar window )
- Card Film Container ( banyak kolomnya menyesuaikan lebar window )