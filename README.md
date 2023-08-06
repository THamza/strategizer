# Strategizer - Marketing Strategy Generator

The Strategizer is a platform that leverages ChatGPT to generate marketing strategies and content. It incorporates a custom prompt manager to ensure ChatGPT has the necessary context and generates interesting and intriguing information.

## Deployment

The Strategizer is deployed using Vercel. The deployment process is streamlined, allowing you to easily specify the branch for deployment. This enables efficient testing and iteration on different branches before pushing changes to production.

To deploy the app, follow these steps:

1. Install the Vercel CLI globally: `npm install -g vercel`.
2. Run `vercel login` to authenticate with your Vercel account.
3. From the project root directory, run `vercel --prod` to deploy to the production environment.
4. For staging or development environments, specify the branch using `vercel --prod --scope=<branch-name>`.

## Database

The Strategizer uses PlanetScale as the database provider. PlanetScale offers an automatically scalable MySQL serverless database solution. It provides a powerful branching feature that allows you to have separate branches for development, acceptance, and production environments. This enables isolated development and testing without impacting the live production environment.

To connect and manage the database, follow these steps:

1. Create a PlanetScale account and set up your project.
2. Connect the Strategizer to the PlanetScale database by providing the appropriate connection URL in your application's configuration.
3. Synchronize the database schema with Prisma by running `npx prisma db push`.
4. Use `npx prisma studio` to open Prisma Studio and manage your database.

#### ERD

<img width="1156" alt="Screenshot 2023-07-05 at 12 16 32 PM" src="[[https://github.com/THamza/strategizer/assets/36136494/f7f9d3f3-c875-48cf-8745-751d475128f0](https://raw.githubusercontent.com/THamza/strategizer/main/prisma-erd.svg)](https://raw.githubusercontent.com/THamza/strategizer/main/prisma-erd.svg)">
https://raw.githubusercontent.com/THamza/strategizer/main/prisma-erd.svg

## Versioning and Workflow

The Strategizer follows the Git Flow workflow for version control. The main branches used are:

- `dev`: The development branch where new features and bug fixes are implemented.
- `acceptance`: The acceptance branch where changes are tested and reviewed before merging into the main branch.
- `main` (prod): The main production branch that contains stable and tested code.

To contribute to the Strategizer, follow these best practices:

1. Create a new branch from `dev` for each new feature or bug fix.
2. Commit your changes to the branch and push to the remote repository.
3. Submit a pull request from your branch to the `dev` branch.
4. Once the changes are reviewed and approved, they can be merged into the `dev` branch.
5. Regularly merge the `dev` branch into `acceptance` for testing and review.
6. After thorough testing and review, merge the `acceptance` branch into `main` for production deployment.

## Authentication

User authentication in the Strategizer is handled by Clerk. Clerk provides a seamless and secure authentication solution with built-in features like user registration, login, and password management. It integrates easily with various identity providers and offers customizable authentication flows.

To configure Clerk in the Strategizer:

1. Create a Clerk account and set up your project.
2. Follow the Clerk documentation to integrate it into your app's authentication flow.
3. Use Clerk's authentication components and APIs to handle user registration and login.

## Logging Manager

The Strategizer utilizes Axiom as the logging manager. Axiom provides powerful logging capabilities to track and monitor application events, errors, and performance metrics. It allows you to collect and analyze log data for debugging and optimizing your app.

To integrate Axiom into the Strategizer:

1. Create an Axiom account and set up your project.
2. Install the Axiom SDK in your application's backend and frontend.
3. Configure the Axiom SDK with your project credentials and logging settings.
4. Use the provided logging functions to log relevant events and errors in your application.

## Notes

Here are some additional notes and considerations for the Strategizer:

- The Strategizer is deployed on Vercel, providing a convenient and scalable hosting solution. It allows you to easily manage different branches and deploy changes to the appropriate environments.
- PlanetScale's branching feature enables seamless database management across different development stages. It allows you to synchronize and switch between branches, ensuring data integrity and consistent testing.
- Consider adding prompt manager databases to enhance the generation and storage of elements within the Strategizer. This can provide flexibility in managing and utilizing generated prompts and suggestions.
- Explore options for user suggestions and feedback within the Strategizer. Providing users with the ability to contribute their ideas and insights can enhance engagement and the overall user experience.

## Future Work

As the Strategizer continues to evolve, consider incorporating the following features and enhancements:

- Analytics: Add analytics capabilities to track and measure marketing performance metrics such as engagement, reach, conversion rates, and more. This data can provide valuable insights into the effectiveness of different marketing strategies and help optimize future campaigns.
- Campaigns: Introduce a concept of campaigns within the Strategizer. A project can have multiple campaigns, each with its own goals, timeline, and associated content. This allows users to plan and manage their marketing efforts more effectively.

  ***

# Create Strategizer

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

# Future work:

- somewhere where you can store and visualize prompts
- tests
- add all the checks (rate limitter + project + right access) into some middleware
- When creting a post, you are asked to select a social media. add the option "Other" where you can write whats special about the social media platform
