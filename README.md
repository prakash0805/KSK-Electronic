# KSK Electronics — Backend (Node.js + Express + MongoDB)

A simple backend for the KSK Electronics TV Repair website. It serves the
existing website as-is from `/public`, and adds three things the static site
didn't have:

1. **Enquiry storage** — every "Enquire About a Repair" form submission is now
   saved to MongoDB (it still opens WhatsApp/SMS exactly as before too).
2. **Dynamic services list** — the 16 service cards are seeded into MongoDB
   and served over an API, so the owner can add/remove a service later
   without editing code.
3. **Reviews API** — a place to store and serve customer reviews.
4. **Owner dashboard** (`/admin.html`) — a simple password-protected page to
   see every enquiry that has come in, with name, phone, issue and status.

## Project structure
```
ksk-backend/
├── server.js          # Express app entry point
├── seed.js            # one-time script to load services + sample reviews
├── models/            # Enquiry, Service, Review (Mongoose schemas)
├── routes/            # /api/enquiries, /api/services, /api/reviews
├── public/             # the website itself (index.html + images) — served as-is
└── .env.example        # copy to .env and edit
```

## Setup

1. **Install MongoDB** locally, or create a free cluster at
   [MongoDB Atlas](https://www.mongodb.com/atlas).

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # then edit .env — set MONGODB_URI, ADMIN_KEY, PORT
   ```

4. **Seed the database** (loads the 16 services + 3 sample reviews)
   ```bash
   npm run seed
   ```

5. **Run the server**
   ```bash
   npm start        # production
   npm run dev       # auto-restart on changes (needs devDependencies installed)
   ```

6. Open **http://localhost:5000** — that's the KSK Electronics website,
   now backend-powered. Open **http://localhost:5000/admin.html** and enter
   your `ADMIN_KEY` to see incoming enquiries.

## API reference

| Method | Endpoint             | Auth        | Purpose                              |
|--------|-----------------------|-------------|---------------------------------------|
| GET    | `/api/health`          | none        | Check the server is up               |
| GET    | `/api/services`        | none        | List active repair services          |
| GET    | `/api/reviews`         | none        | List approved customer reviews       |
| POST   | `/api/reviews`         | none        | Submit a new review                  |
| POST   | `/api/enquiries`       | none        | Submit a repair enquiry (the form)   |
| GET    | `/api/enquiries`       | admin key   | List all enquiries                   |
| PATCH  | `/api/enquiries/:id`   | admin key   | Update an enquiry's status           |
| DELETE | `/api/enquiries/:id`   | admin key   | Remove an enquiry                    |

Admin routes require header: `x-admin-key: <your ADMIN_KEY>`

## Why this design
The original site worked entirely client-side (the form just opened
WhatsApp/SMS with a pre-filled message). That still works unchanged — the
backend just quietly also saves the same enquiry to MongoDB, so KSK
Electronics has a permanent record of every lead even if a customer never
taps "Send" in WhatsApp.
