# How to Run project

> Pre-request: You must have mysql or mariadb server on localhost port 3306.
> Copy .env.example and change the database url according to your system's need.

1. `npm i`
2. `npx prisma migrate dev --name init`
3. `npx prisma migrate deploy`
4. `npx prisma generate`
5. `node seed.js`
6. `npm run build`
7. `npm run start`

Then go to `localhost:3000`.

You can login admin account with `admin@gmail.com` and password `admin`.
