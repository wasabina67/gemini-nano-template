const LANGUAGE = 'ja';
const LANGUAGE_OPTIONS = {
  expectedInputs: [{ type: 'text', languages: [LANGUAGE] }],
  expectedOutputs: [{ type: 'text', languages: [LANGUAGE] }],
};

let session = null;

const status = document.getElementById('status');
const initModelButton = document.getElementById('init-model');
const messageInput = document.getElementById('message-input');
const submitButton = document.getElementById('submit-button');

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
