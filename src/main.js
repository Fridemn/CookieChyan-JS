import "./style.css";
import { log } from "./utils.js";

(function () {
  "use strict";

  function onCopyToClipboardSuccess() {
    log("✅ Copied cookies to clipboard successfully.");
    showNotification("Cookies successfully copied!", "#27b92788");
  }

  function onCopyToClipboardError(err) {
    log("❌ Failed to copy cookies to clipboard, details show below.");
    console.error(err);
    showNotification("Cookies failed to copy!", "#cc2a2a88");
  }

  function copyToClipboardGM(text) {
    if (typeof GM_setClipboard !== "undefined") {
      log("📄 Copying cookies to clipboard via GM API");
      GM_setClipboard(text, "text");
      onCopyToClipboardSuccess();
      return true;
    }
    return false;
  }

  function copyToClipboardNav(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      log("📄 Copying cookies to clipboard via Navigator API");
      navigator.clipboard
        .writeText(text)
        .then(() => {
          onCopyToClipboardSuccess();
        })
        .catch((err) => {
          onCopyToClipboardError(err);
        });
      return true;
    }
    return false;
  }

  function showNotification(message, color) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.className = "cookie-chyan-notification";
    notification.style.backgroundColor = color;
    notification.style.animation = "cookieChyanSlideIn 0.3s ease-out";

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "cookieChyanSlideOut 0.3s ease-out";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 200);
    }, 4000);
  }

  function handleKeyPress(event) {
    // Ctrl + Alt + C
    if (event.ctrlKey && event.altKey && event.key.toLowerCase() === "c") {
      event.preventDefault();

      const cookies = document.cookie;

      if (cookies) {
        copyToClipboardGM(cookies) || copyToClipboardNav(cookies);
      } else {
        log("🚮 No cookies found.");
        showNotification("No cookies found.", "#bd741488");
      }
    }
  }

  document.addEventListener("keydown", handleKeyPress);

  log("🚀 CookieChyan-JS script successfully loaded!");
})();
