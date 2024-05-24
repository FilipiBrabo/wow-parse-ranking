# WoW Parse Rank

## Project Description

WoW Parse Rank is a project dedicated to ranking Brazilian players of World of Warcraft Classic. Through the collection and filtering of data from the Warcraft Logs API, this project provides a platform that ranks players based on their in-game performance.

## Project Structure

The project is organized as a monorepo using [Nx](https://nx.dev/), including a backend and a frontend application.

### Backend

Built with [NestJS](https://nestjs.com/) and uses [Prisma](https://www.prisma.io/) to interact with a PostgreSQL database. To facilitate environment setup, a Docker Compose file is available to start the PostgreSQL database, along with a seed file to populate it with initial data.

#### Main Technologies:
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://docs.docker.com/)

#### Features:
- Retrieval and filtering of data from the Warcraft Logs API
- Ranking of players
- Provision of results through endpoints

### Frontend

Developed using Next.js in conjunction with ShadcnUI. Its main function is to display the ranked data provided by the backend.

#### Main Technologies:
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)

#### Features:
- Display of ranked data provided by the backend

## Execution Instructions

### Backend

1. Execute `pnpm install` to install dependencies
2. Create a `.env` file. Refer to `.env.example` to see which variables are needed.
    1. If using `docker-compose` to start the database refer to `.env.local` to see connection strings.
    2. To obtain a token, refer to the [Warcraft Logs documentation](https://www.warcraftlogs.com/api/docs) for instructions.
3. Execute `docker-compose up -d` to start the PostgreSQL database
4. Execute `npx nx run parse-ranking-back-end:prisma-generate` to generate prisma client
5. Execute `npx nx run parse-ranking-back-end:prisma-migrate` to apply migrations
6. Execute `npx nx run parse-ranking-back-end:prisma-seed` to apply the seed
7. Execute `npx nx run parse-ranking-back-end:serve` to start the backend server

The server should be running at `http://localhost:3000`.

### Frontend

1. Execute `pnpm install` to install dependencies
7. Execute `npx nx run parse-ranking-front-end:serve` to start the backend server

Access the application through the browser at `http://localhost:4200`.

## Contribution

Contributions are welcome! Feel free to open issues or submit pull requests to improve this project.

## License

This project is licensed under the [MIT License](LICENSE).
