# System chart
                    Frontend (Next.js)

                            |
                            v

                    API Gateway (Express)

        ------------------------------------------------
        |                 |                |           |
        v                 v                v           v

    Auth Service     Product Service   Order Service  Realtime Service

        |                 |                |           |
        ------------------------------------------------
                            |
                      PostgreSQL
                            |
                         Redis

# VAULT Backend Tech Stack
API Gateway - ExpressJS
Services - Node.js + ExpressJS
ORM - Prisma
Database - PostgreSQL (Local)
Realtime - Socket.IO
Cache/Realtimesession - Redis
Validation - Zod
Auth - JWT

# Danh sách microservices:

A. Auth Service
Chức năng:
- register
- login
- JWT
- role check

APIs
POST /auth/register
POST /auth/login
GET  /auth/me

B. Product Service
Chức năng:
- product listing
- product detail
- inventory
- smart sizing basic

APIs
GET /products
GET /products/:id
POST /products
PATCH /products/:id

C. Order Service
Chức năng:
- cart
- checkout
- order tracking
- payment mock

APIs
POST /cart
GET  /cart
POST /checkout
GET  /orders/:id

D. Realtime Service
Socket.IO

Realtime:
order status update
inventory update
admin notification

# REPO Stucture
vault-backend/
│
├── gateway/
├── auth-service/
├── product-service/
├── order-service/
├── realtime-service/
│
├── shared/
│   ├── utils/
│   ├── middleware/
│   └── types/
│
└── package.json

## Services

- Gateway : 3000
- Auth    : 3001
- Product : 3002
- Order   : 3003
- Realtime: 3004

## API
Auth
/api/auth/register
/api/auth/login
/api/auth/me

Product
/api/products

Order
/api/orders