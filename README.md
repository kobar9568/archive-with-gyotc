# Archive with gyotc

Firefox extension that adds **Archive with gyotc** to the page context menu.
When clicked, it opens:

`https://gyo.tc/<current-page-url>`

in a new tab.

- Newly opened archive tabs are inserted immediately to the right of the current tab.

## Added setting

A simple options page is included.

- **Replace the username with `i` for X/Twitter Tweet URLs**
  - Example:
    - `https://x.com/elonmusk/status/1519480761749016577`
    - `https://x.com/i/status/1519480761749016577`

## Temporary installation in Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on...**
3. Select `manifest.json` inside this folder

## Notes

- Only `http` and `https` pages are handled.
- `about:`, `file:`, `moz-extension:` and similar URLs are ignored.
- The X/Twitter conversion only applies to Tweet status URLs when the option is enabled.
