<h1 align="center">
  <img alt="icon" width="250" src="https://github.com/user-attachments/assets/b42897bf-f45e-413f-adfe-77a80c51bf1e" />
  <br>Yotsuba
</h1>

*Keeping people anonymous since 2003!*

Yotsuba is a small Slack bot inspired by the user identification system of 4chan. You can reply to a Slack message in a thread while being anonymous, but not fully. Each user is assigned a unique ID that is used to track their messages. This ID is unique to each user and each thread.

IDs are determined by the user's Slack ID, thread ID, and a random salt, making it untraceable back to the user's account.

Here is how it looks in action:

<img width="700" alt="example" src="https://github.com/user-attachments/assets/8c87f3d7-d276-4c74-8e52-4ec28fab7b80" />

The same user will show differently when done in a different thread. This means we can not trace the hotdog advocate to their stance on Hatsune Miku

<img width="700" alt="example 2" src="https://github.com/user-attachments/assets/3a954121-ad18-4b7d-b2db-f5b72ab01bd3" />

## Development

This is really just a glorified echo bot, so running it is stupid simple.

1. Clone it (duh)
2. Copy `.env.example` to `.env`
3. Fill in the `.env` file with your Slack bot token, signing secret, app token, and change the `ANON_SALT` to something random.
4. Run `pnpm i` to install packages and use `pnpm run dev` to start the bot.
5. Profit?
