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

B. Product Service
Chức năng:
- product listing
- product detail
- inventory
- smart sizing basic

C. Order Service
Chức năng:
- cart
- checkout
- order tracking
- payment mock

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
POST    /api/auth/register
POST    /api/auth/login
GET     /api/auth/me

Product
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id

Cart
GET    /api/cart
POST   /api/cart
DELETE /api/cart/:itemId

Sizing Rule
POST    /api/sizing/rules

Review
POST    /api/reviews
GET     /api/reviews/:id

Order
POST    /api/orders/checkout (check out tính tổng tiền giỏ hàng và xóa giỏ hàng)
GET     /api/orders/my-orders
PATCH   /api/orders/:id/status (sửa giữa các trạng thái: "pending", "confirmed", "shipping", "delivered", "cancelled",)

Admin
GET     /api/admin/stats
GET     /api/admin/orders
GET     /api/admin/products