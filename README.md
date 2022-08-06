# Hướng dẫn cài đặt

Cài đặt nodejs phiên bản 16 trở lên

## Database

Bước 1: cd backend/models    
Bước 2: Sửa file knexfile.js để kết nối đến database    
Bước 3: npm install -g knex   
Bước 4: knex migrate:latest    

## Backend
Bước 1: cd backend    
Bước 2: npm install    
Bước 3: sửa file cấu hình .env phù hợp   
Bước 4: node index.js

## Frontend

Bước 1: cd frontend   
Bước 2: npm install

### Chạy deployment
Bước 3: npm start

### Chạy production
Bước 3: npm run build   
Bước 4: npm install -g serve    
Bước 5: serve -s build    
