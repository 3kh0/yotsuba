export function access(id) {
  const whitelistEnabled = process.env.WHITELIST_ENABLED === 'true';
  
  if (!whitelistEnabled) return true;
  
  const whitelist = process.env.CHANNEL_WHITELIST || '';
  const allowed = whitelist.split(',').map(id => id.trim()).filter(Boolean);
  
  if (allowed.length === 0) return true;
  
  return allowed.includes(id);
}

export async function post(client, channelId, threadTs, text, profile) {
  return await client.chat.postMessage({
    channel: channelId,
    thread_ts: threadTs,
    text,
    username: `Anon-${profile.shorthand}`,
    icon_url: profile.iconUrl,
  });
}

export async function openModal(client, triggerId, metadata) {
  return await client.views.open({
    trigger_id: triggerId,
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
}
