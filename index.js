import 'dotenv/config';
import pkg from '@slack/bolt';
const { App } = pkg;
import { genHash, genShort } from './lib/hash.js';
import { access, post, openModal } from './lib/msg.js';

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

    if (!access(channel.id)) {
      await client.chat.postEphemeral({
        channel: channel.id,
        user: user.id,
        text: 'I am not whitelisted to post here. Please contact the bot host if this is a mistake.',
      });
      return;
    }
    
    const metadata = JSON.stringify({
      userId: user.id,
      channelId: channel.id,
      threadTs,
    });

    await openModal(client, trigger_id, metadata);
  } catch (error) {
    console.error('modal error', error);
  }
});

app.view('anon_submit', async ({ ack, body, view, client }) => {
  await ack();
  
  try {
    const metadata = JSON.parse(view.private_metadata);
    const { userId, channelId, threadTs } = metadata;
    
    if (!access(channelId)) {
      await client.chat.postEphemeral({
        channel: channelId,
        user: userId,
        text: 'I am not whitelisted to post here. Please contact the bot host if this is a mistake.',
      });
      return;
    }
    
    const reply = view.state.values.reply_block.reply_text.value;
    
    if (!reply || reply.trim().length === 0) {
      return;
    }
    const hash = genHash(userId, threadTs);
    const profile = await buildProfile(hash, client);
    
    await post(client, channelId, threadTs, reply, profile);
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
