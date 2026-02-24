# About DevTinder
DevTinder is a modern web application designed to help developers connect, collaborate, and network with other tech enthusiasts. It combines a clean, responsive frontend with a robust Node.js backend and a secure MongoDB database.

# Technology Stack
Frontend: React

Backend: Node.js, Express.js

Database: MongoDB Atlas

Server & Deployment: AWS EC2, Nginx, PM2

# Deployment
- Signup on AWS
- Launch EC2 instance
- chmod 400 <secret>.pem
- ssh -i "<your-key-file>.pem" ubuntu@<your-ec2-public-dns>
- Install Node version 16.17.0
- Git clone
- Frontend    
    - npm install  -> install dependencies
    - npm run build
    - sudo apt update
    - sudo apt install nginx
    - sudo systemctl start nginx
    - sudo systemctl enable nginx
    - Copy code from dist(build files) to /var/www/html/
    - sudo scp -r dist/* /var/www/html/
    - Enable port :80 of your instance
- Backend
    - allow ec2 instance public IP on mongodb server
    - npm intsall pm2 -g -> Process Manager to run backend 24/7
    - pm2 start npm --name "devTinder-backend" -- start
    - pm2 logs
    - pm2 list, pm2 flush <name> , pm2 stop <name>, pm2 delete <name>
    - config nginx - /etc/nginx/sites-available/default
    - restart nginx - sudo systemctl restart nginx
    - Modify the BASEURL in frontend project to "/api"

- Nginx Config : 

    Frontend = http://43.204.96.49/
    
    Backend = http://43.204.96.49:7777/

    Domain name = devtinder.com => 43.204.96.49

    Frontend = devtinder.com
    Backend = devtinder.com:7777 => devtinder.com/api

    nginx config : 

    server_name 43.204.96.49;

    location /api/ {
        proxy_pass http://localhost:7777/;  # Pass the request to the Node.js app
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

# Frontend Change
const BASE_URL = "/api";

# Request Flow
![alt text](image.png)
