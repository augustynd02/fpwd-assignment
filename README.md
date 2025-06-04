### FPWD - recruitment challenge

## Features

- Backend retrieves exchange rate from given API, stores in-memory cache for 60 seconds
- Stores transactions in-memory (can be replaced with DB calls)
- User on client-side can convert EUR to PLN with the current exchange rate
- Client automatically refetches exchange rate whenever it expires (in sync with server)

---

## Setup

1. **Install dependencies**

```bash
npm install
cd frontend
npm install
cd ../backend
npm install
```

2. **Setup .env files**
```bash
# Frontend directory (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend directory (.env)
PORT=8000
FRONTEND_URL="http://localhost:3000"
API_URL="https:example.com"
API_KEY="key-example"
```

3. **Run both servers from root directory**
```bash
npm run dev
```


