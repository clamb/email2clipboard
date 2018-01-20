function listenForClicks() {
  const copyStudentsRow = tabs => {
    browser.tabs.sendMessage(tabs[0].id, {
      command: "copyStudentsRow"
    });
  };

  const copyStudentsColumn = tabs => {
    browser.tabs.sendMessage(tabs[0].id, {
      command: "copyStudentsColumn"
    });
  };

  const copyTeachersRow = tabs => {
    browser.tabs.sendMessage(tabs[0].id, {
      command: "copyTeachersRow"
    });
  };

  const copyTeachersColumn = tabs => {
    browser.tabs.sendMessage(tabs[0].id, {
      command: "copyTeachersColumn"
    });
  };

  const reportError = error => {
    console.error(`Ooops, une erreur est survenue: ${error}`);
  };

  console.log("listenForClicks");
  document.querySelector("button#students-row").addEventListener("click", () => {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(copyStudentsRow)
      .catch(reportError);
  });
  document.querySelector("button#students-column").addEventListener("click", () => {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(copyStudentsColumn)
      .catch(reportError);
  });
  document.querySelector("button#teachers-row").addEventListener("click", () => {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(copyTeachersRow)
      .catch(reportError);
  });
  document.querySelector("button#teachers-column").addEventListener("click", () => {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(copyTeachersColumn)
      .catch(reportError);
  });
}

function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute Email2Clipboard: ${error.message}`);
}

browser.tabs
  .executeScript({ file: "/content_scripts/copy.js" })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
