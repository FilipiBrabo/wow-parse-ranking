# WoW Parse Rank

## Project Description

WoW Parse Rank is a project dedicated to ranking Brazilian players of World of Warcraft Classic. Through the collection and filtering of data from the Warcraft Logs API, this project provides a platform that ranks players based on their in-game performance.

## Project Structure

The project is organized as a monorepo using [Nx](https://nx.dev/)

Developed using Next.js in conjunction with ShadcnUI.

#### Main Technologies:

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)

## Execution Instructions

1. `pnpm install` to install dependencies
2. `docker compose up` to spin the database
3. `npx nx dev parse-ranking-front-end` to start the frontend server

Access the application through the browser at `http://localhost:3000`.

## Contribution

Contributions are welcome! Feel free to open issues or submit pull requests to improve this project.

## License

This project is licensed under the [MIT License](LICENSE).
