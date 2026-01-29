const LANGUAGE = 'ja';
const LANGUAGE_OPTIONS = {
  expectedInputs: [{ type: 'text', languages: [LANGUAGE] }],
  expectedOutputs: [{ type: 'text', languages: [LANGUAGE] }],
};

let session = null;

const status = document.getElementById('status');
const initModelButton = document.getElementById('init-model');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const submitButton = document.getElementById('submit-button');

function addMessage(text, isUser) {
  const messageDiv = document.createElement('div');
  messageDiv.className = isUser ? 'message user-message' : 'message ai-message';
  if (isUser) {
    messageDiv.textContent = text;
  } else {
    messageDiv.innerHTML = marked.parse(text);
  }
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return messageDiv;
}

async function handleSubmit(e) {
  e.preventDefault();

  const text = messageInput.value.trim();
  if (!text || !session) return;

  addMessage(text, true);
  messageInput.value = '';
  messageInput.disabled = true;
  submitButton.disabled = true;

  const responseDiv = addMessage('', false);

  try {
    const stream = session.promptStreaming(text);
    let fullText = '';
    for await (const chunk of stream) {
      fullText += chunk;
      responseDiv.innerHTML = marked.parse(fullText);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  } catch (error) {
    responseDiv.innerHTML = marked.parse('Error: ' + error.message);
    console.error(error);
  } finally {
    messageInput.disabled = false;
    submitButton.disabled = false;
    messageInput.focus();
  }
}

chatForm.addEventListener('submit', handleSubmit);

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatForm.dispatchEvent(new Event('submit'));
  }
});

async function createSession() {
  status.textContent = 'Initializing...';
  initModelButton.style.display = 'none';

  try {
    session = await LanguageModel.create({
      ...LANGUAGE_OPTIONS,
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          status.textContent = `Downloading: ${Math.round(e.loaded * 100)}%`;
        });
      },
    });
    status.textContent = 'Ready';
    messageInput.disabled = false;
    submitButton.disabled = false;
    messageInput.focus();
  } catch (error) {
    status.textContent = error.message;
    initModelButton.style.display = 'block';
    console.error(error);
  }
}

async function init() {
  if (typeof LanguageModel === 'undefined') {
    status.textContent = 'Not supported';
    return;
  }

  try {
    const availability = await LanguageModel.availability(LANGUAGE_OPTIONS);
    if (availability === 'unavailable') {
      status.textContent = 'Unavailable';
      return;
    } else if (availability === 'available') {
      await createSession();
    } else {
      status.textContent = 'Model download required';
      initModelButton.style.display = 'block';
      initModelButton.addEventListener('click', createSession);
    }
  } catch (error) {
    status.textContent = error.message;
    console.error(error);
  }
}

init();
