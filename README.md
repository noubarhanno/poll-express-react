# Voting Poll platform for Sabbar code assessment

## Introduction

Simple web application that allows users to create polls and vote on them. It is built using the following technologies:

- Backend: Node.js, Express.js, SQLite, sequelize-typescript
- Frontend: React.js, Material-UI
- Typescript

## Installation

### Backend

the backend service is located in the `backend` directory. To install the dependencies, run the following command:

```bash
cd backend
npm install
```

To run the backend service, run the following command:

```bash
npm start
```

here are some important tips:

- the backend service is built using `nodemon` and will restart automatically when changes are made.
- the port number is set to `4000` by default.
- the database is located in the `backend` directory under `db.sqlite` file by default, when you run the backend service the database file will be created automatically.
- the database can be configured using the `backend/config/db.config.ts` file.
