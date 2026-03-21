# SaaS Project Boilerplate Generation

## Objective
Act as an autonomous software engineer. Your goal is to complete this Next.js SaaS boilerplate by implementing all the requirements listed below. 

## Requirements
- [x] Create a `/health` endpoint that returns a 200 OK status.
- [x] Set up Stripe Payment processing using 
- [x] Allow users to upgrade, downgrade, or cancel their subscription
- [x] make sure when they subscribe to a product they have a custom payment portal that is inside the web app and doesn't go to stripe externally.  Use the stripe keys, and secret keys that are provided in .env.local
- [x] Update the landing page which is the root page in src/app/page.tsx and make it appealing, professional and polished.
- [x] Build application and upon no build errors do a git commit and push it to it's git repository

## Execution Loop Instructions
You must operate in a continuous loop until all tasks are complete. For every iteration, follow these exact steps:
1. **Assess:** Read the current state of the project and check this `program.md` file to find the first uncompleted task.
2. **Execute:** Write or modify the necessary files to complete the task.
3. **Verify:** Run standard checks (e.g., execute `node src/index.js` briefly, or run `npm test`). 
4. **Self-Correct:** If a test or command fails, read the error output in your terminal, fix the code, and verify again.
5. **Update:** Once the task is successfully implemented and working, edit this `program.md` file and change the `[ ]` to `[x]` for that specific task.
6. **Commit:** Commit your changes to git with a descriptive commit message (e.g., `git add . && git commit -m "feat: setup Express server"`).
7. **Evaluate:** If there are still unchecked tasks, move to the next one. If all tasks are `[x]`, terminate the loop and announce completion.