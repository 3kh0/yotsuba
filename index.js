import 'dotenv/config';
import pkg from '@slack/bolt';
const { App } = pkg;
import { genHash, genShort } from './lib/hash.js';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

async function buildProfile(hash) {
  const shorthand = genShort(hash);
  const iconUrl = `https://identicon.02420.dev/${hash}/512?format=png`;
  return { shorthand, iconUrl };
}

app.shortcut('anon_reply', async ({ shortcut, ack, client }) => {
  await ack();
  
  try {
    const { user, message, channel, trigger_id } = shortcut;
    const threadTs = message.thread_ts || message.ts;
    
    const metadata = JSON.stringify({
      userId: user.id,
      channelId: channel.id,
      threadTs,
    });

    await client.views.open({
      trigger_id,
      view: {
        type: 'modal',
        callback_id: 'anon_submit',
        private_metadata: metadata,
        title: {
          type: 'plain_text',
          text: 'Anonymous Reply',
        },
        blocks: [
          {
            type: 'input',
            block_id: 'reply_block',
            element: {
              type: 'plain_text_input',
              action_id: 'reply_text',
              multiline: true,
              placeholder: {
                type: 'plain_text',
                text: 'Type your response here. You will be an anonymous user.',
              },
            },
            label: {
              type: 'plain_text',
              text: 'Your reply',
            },
          },
        ],
        submit: {
          type: 'plain_text',
          text: 'Submit',
        },
      },
    });
  } catch (error) {
    console.error('modal error', error);
  }
});

app.view('anon_submit', async ({ ack, body, view, client }) => {
  await ack();
  
  try {
    const metadata = JSON.parse(view.private_metadata);
    const { userId, channelId, threadTs } = metadata;
    
    const reply = view.state.values.reply_block.reply_text.value;
    
    if (!reply || reply.trim().length === 0) {
      return;
    }
    const hash = genHash(userId, threadTs);
    const profile = await buildProfile(hash, client);
    
    await client.chat.postMessage({
      channel: channelId,
      thread_ts: threadTs,
      text: reply,
      username: `Anon-${profile.shorthand}`,
      icon_url: profile.iconUrl,
    });
  } catch (error) {
    console.error('error on anon_submit', error);
  }
});

(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log('Yotsuba!');
  } catch (error) {
    console.error(':( ', error);
    process.exit(1);
  }
})();
