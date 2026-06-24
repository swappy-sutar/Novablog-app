# Stage 1: Base node environment and dependencies
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Development environment (runs Vite with HMR)
FROM base AS development
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# Stage 3: Build frontend production assets
FROM base AS builder
ARG VITE_API_URL=http://localhost:3000/api/v1
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# Stage 4: Serve built files with Nginx
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
