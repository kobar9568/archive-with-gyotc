const DEFAULT_SETTINGS = {
  replaceTweetUsernameWithI: false,
  trimBirdwatchQueryParams: true,
};

const replaceTweetUsernameCheckbox = document.getElementById("replaceTweetUsernameWithI");
const trimBirdwatchQueryParamsCheckbox = document.getElementById("trimBirdwatchQueryParams");
const status = document.getElementById("status");

async function restoreOptions() {
  const settings = await browser.storage.local.get(DEFAULT_SETTINGS);
  replaceTweetUsernameCheckbox.checked = Boolean(settings.replaceTweetUsernameWithI);
  trimBirdwatchQueryParamsCheckbox.checked = Boolean(settings.trimBirdwatchQueryParams);
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
    replaceTweetUsernameWithI: replaceTweetUsernameCheckbox.checked,
    trimBirdwatchQueryParams: trimBirdwatchQueryParamsCheckbox.checked,
  });
  showStatus("保存しました。");
}

replaceTweetUsernameCheckbox.addEventListener("change", saveOptions);
trimBirdwatchQueryParamsCheckbox.addEventListener("change", saveOptions);
document.addEventListener("DOMContentLoaded", restoreOptions);
