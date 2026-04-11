const DEFAULT_SETTINGS = {
  replaceTweetUsernameWithI: false,
};

const checkbox = document.getElementById("replaceTweetUsernameWithI");
const status = document.getElementById("status");

async function restoreOptions() {
  const settings = await browser.storage.local.get(DEFAULT_SETTINGS);
  checkbox.checked = Boolean(settings.replaceTweetUsernameWithI);
}

let statusTimer = null;
function showStatus(message) {
  status.textContent = message;
  if (statusTimer) {
    clearTimeout(statusTimer);
  }
  statusTimer = setTimeout(() => {
    status.textContent = "";
  }, 1800);
}

async function saveOptions() {
  await browser.storage.local.set({
    replaceTweetUsernameWithI: checkbox.checked,
  });
  showStatus("保存しました。");
}

checkbox.addEventListener("change", saveOptions);
document.addEventListener("DOMContentLoaded", restoreOptions);
