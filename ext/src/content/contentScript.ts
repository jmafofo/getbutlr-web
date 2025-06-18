import { sendMessageToBackground } from '../background/background';

const INTERVAL = 1000;
let lastTitle = '';

function extractFields() {
  const titleEl = document.querySelector<HTMLInputElement>('#textbox[aria-label="Title"]');
  const descEl = document.querySelector<HTMLTextAreaElement>('textarea[aria-label="Description"]');
  return { title: titleEl?.value || '', description: descEl?.value || '' };
}

setInterval(() => {
  const { title, description } = extractFields();
  if (title && title !== lastTitle) {
    lastTitle = title;
    sendMessageToBackground({ type: 'SEO_CHECK', payload: { title, description } });
  }
}, INTERVAL);

