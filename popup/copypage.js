function listenForClicks() {


  const copyStudentsRow = tabs => {
    browser.tabs.sendMessage(tabs[0].id, {
      command: "copyStudentsRow"
    });
    notifyDone();
  };

  const copyStudentsColumn = tabs => {
    browser.tabs.sendMessage(tabs[0].id, {
      command: "copyStudentsColumn"
    });
    notifyDone();
  };

  const copyTeachersRow = tabs => {
    browser.tabs.sendMessage(tabs[0].id, {
      command: "copyTeachersRow"
    });
    notifyDone();
  };

  const copyTeachersColumn = tabs => {
    browser.tabs.sendMessage(tabs[0].id, {
      command: "copyTeachersColumn"
    });
    notifyDone();
  };

  const notifyDone = () => {
    browser.notifications.create({
      type: "basic",
      title: "Données copiées",
      message: "Les données sont copiées dans le presse-papier. CTRL-V ou CMD-V pour les coller."
    });
    window.close();
  }

  const reportError = error => {
    browser.notifications.create({
      type: "basic",
      title: "Erreur interne",
      message: "Il y eu une erreur: " + error
    });
    console.error(`Ooops, une erreur est survenue: ${error}`);
  };

  document.querySelector("button#students-row").addEventListener("click", () => {
    getCurrentTab()
      .then(copyStudentsRow)
      .catch(reportError);
  });
  document.querySelector("button#students-column").addEventListener("click", () => {
    getCurrentTab()
      .then(copyStudentsColumn)
      .catch(reportError);
  });
  document.querySelector("button#teachers-row").addEventListener("click", () => {
    getCurrentTab()
      .then(copyTeachersRow)
      .catch(reportError);
  });
  document.querySelector("button#teachers-column").addEventListener("click", () => {
    getCurrentTab()
      .then(copyTeachersColumn)
      .catch(reportError);
  });

  const getCurrentTab = () => browser.tabs.query({
    active: true,
    currentWindow: true
  });
}


function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute Email2Clipboard: ${error.message}`);
}


const manifest = browser.runtime.getManifest();
document.querySelector("#version").textContent = `${manifest.name}, v${manifest.version}`;

const okelt = document.querySelector("#ok");
const notokelt = document.querySelector("#notok");

chrome.tabs.query({
  active: true,
  lastFocusedWindow: true
}, tabs => {
  const url = tabs[0].url;
  if (url.match(/https:\/\/intranet.cpnv.ch\/classes\/[^\/]+\/?$/) !== null) {
    notokelt.classList.add('hidden');
    okelt.classList.remove('hidden');

    browser.tabs
      .executeScript({
        file: "/content_scripts/copy.js"
      })
      .then(listenForClicks)
      .catch(reportExecuteScriptError);
  } else {
    okelt.classList.add('hidden');
    notokelt.classList.remove('hidden');
    const matches = url.match(/https?:\/\/(intranet.cpnv.ch\/classes\/[^\/]+)\/?.*$/);
    if (matches !== null) {
      const classeUrl = "https://" + matches[1];
      const urlelt = document.querySelector("#urlelt");
      urlelt.insertAdjacentText('beforebegin', ' (');
      urlelt.insertAdjacentText('afterend', ')');
      urlelt.textContent = 'ici';
      urlelt.setAttribute("href", classeUrl);
      urlelt.addEventListener('click', event => {
        setTimeout(() => {
          window.close()
        }, 500);
      });
    }
  }
});