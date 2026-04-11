const MENU_ID = "archive-with-gyotc";
const MENU_TITLE = "Archive with gyotc";
const DEFAULT_SETTINGS = {
  replaceTweetUsernameWithI: false,
};

function ensureMenu() {
  try {
    browser.contextMenus.removeAll();
  } catch (error) {
    console.error("Failed to clear context menus:", error);
  }

  browser.contextMenus.create({
    id: MENU_ID,
    title: MENU_TITLE,
    contexts: ["page", "frame", "selection", "link", "image", "video", "audio"],
  });
}

function isTweetStatusUrl(url) {
  const hostname = url.hostname.toLowerCase();
  const supportedHosts = new Set([
    "x.com",
    "www.x.com",
    "mobile.x.com",
    "twitter.com",
    "www.twitter.com",
    "mobile.twitter.com",
  ]);

  if (!supportedHosts.has(hostname)) {
    return false;
  }

  const segments = url.pathname.split("/").filter(Boolean);
  return segments.length >= 3 && segments[1] === "status" && segments[2].length > 0;
}

function replaceTweetUsernameWithI(pageUrl) {
  let url;
  try {
    url = new URL(pageUrl);
  } catch (error) {
    console.error("Invalid tweet URL:", pageUrl, error);
    return pageUrl;
  }

  if (!isTweetStatusUrl(url)) {
    return pageUrl;
  }

  const segments = url.pathname.split("/").filter(Boolean);
  segments[0] = "i";
  url.pathname = `/${segments.join("/")}`;
  return url.toString();
}

async function transformPageUrl(pageUrl) {
  const settings = await browser.storage.local.get(DEFAULT_SETTINGS);

  if (settings.replaceTweetUsernameWithI) {
    return replaceTweetUsernameWithI(pageUrl);
  }

  return pageUrl;
}

function buildArchiveUrl(pageUrl) {
  return `https://gyo.tc/${pageUrl}`;
}

browser.runtime.onInstalled.addListener(() => {
  ensureMenu();
});

browser.runtime.onStartup.addListener(() => {
  ensureMenu();
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID) {
    return;
  }

  const pageUrl = info.pageUrl;
  if (!pageUrl) {
    return;
  }

  let parsed;
  try {
    parsed = new URL(pageUrl);
  } catch (error) {
    console.error("Invalid page URL:", pageUrl, error);
    return;
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    console.warn("Unsupported protocol for archiving:", parsed.protocol);
    return;
  }

  const transformedUrl = await transformPageUrl(pageUrl);

  const createProperties = {
    url: buildArchiveUrl(transformedUrl),
  };

  if (tab && typeof tab.index === "number") {
    createProperties.index = tab.index + 1;
  }

  browser.tabs.create(createProperties);
});

ensureMenu();
