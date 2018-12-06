function listenForClicks() {
  const cbEmail = document.getElementById("cbEmail");
  const cbFullname = document.getElementById("cbFullname");
  const cbLastname = document.getElementById("cbLastname");
  const cbFirstname = document.getElementById("cbFirstname");
  const cbAcronym = document.getElementById("cbAcronym");
  const radioFieldSeparator = document.querySelectorAll("input[type=radio][name=separator]");
  const radioRecordSeparator = document.querySelectorAll("input[type=radio][name=rseparator]");

  const getSeparatorChar = v => {
    switch (v) {
      case 'cr':
        return "\n";

      case 'comma':
        return ',';

      case 'semicolon':
        return ';'

      case 'space':
        return ' ';
    }

    return '';
  };

  const getSeparator = nodeList => {
    for (const elt of nodeList) {
      if (elt.checked) {
        return getSeparatorChar(elt.value);
      }
    }

    return '';
  };

  const getCopyDataOptions = () => {
    let fieldSeparator = getSeparator(radioFieldSeparator);
    let recordSeparator = getSeparator(radioRecordSeparator);

    return {
      email: cbEmail.checked,
      fullname: cbFullname.checked,
      lastname: cbLastname.checked,
      firstname: cbFirstname.checked,
      acronym: cbAcronym.checked,
      fieldSeparator,
      recordSeparator,
    };
  };

  const copyStudents = tabs => {
    browser.tabs.sendMessage(tabs[0].id, {
      command: "copyStudents",
      options: getCopyDataOptions()
    });
    notifyDone();
  };

  const copyTeachers = tabs => {
    browser.tabs.sendMessage(tabs[0].id, {
      command: "copyTeachers",
      options: getCopyDataOptions()
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
  };

  const reportError = error => {
    browser.notifications.create({
      type: "basic",
      title: "Erreur interne",
      message: "Il y eu une erreur: " + error
    });
    console.error(`Ooops, une erreur est survenue: ${error}`);
  };

  document
    .getElementById("students")
    .addEventListener("click", () => {
      getCurrentTab()
        .then(copyStudents)
        .catch(reportError);
    });

  document
    .getElementById("teachers")
    .addEventListener("click", () => {
      getCurrentTab()
        .then(copyTeachers)
        .catch(reportError);
    });

  const getCurrentTab = () =>
    browser.tabs.query({
      active: true,
      currentWindow: true
    });
}

function reportExecuteScriptError(error) {
  document.getElementById("popup-content").classList.add("hidden");
  document.getElementById("error-content").classList.remove("hidden");
  console.error(`Failed to execute Email2Clipboard: ${error.message}`);
}

const manifest = browser.runtime.getManifest();
document.getElementById("version").textContent = `${manifest.name}, v${
  manifest.version
}`;

const okelt = document.getElementById("ok");
const notokelt = document.getElementById("notok");

chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  },
  tabs => {
    const url = tabs[0].url;
    if (url.match(/https:\/\/intranet.cpnv.ch\/classes\/[^\/]+\/?$/) !== null) {
      notokelt.classList.add("hidden");
      okelt.classList.remove("hidden");

      browser.tabs
        .executeScript({
          file: "/content_scripts/copy.js"
        })
        .then(listenForClicks)
        .catch(reportExecuteScriptError);
    } else {
      okelt.classList.add("hidden");
      notokelt.classList.remove("hidden");
      const matches = url.match(
        /https?:\/\/(intranet.cpnv.ch\/classes\/[^\/]+)\/?.*$/
      );
      if (matches !== null) {
        const classeUrl = "https://" + matches[1];
        const urlelt = document.querySelector("#urlelt");
        urlelt.insertAdjacentText("beforebegin", " (");
        urlelt.insertAdjacentText("afterend", ")");
        urlelt.textContent = "ici";
        urlelt.addEventListener("click", event => {
          event.preventDefault();
          browser.tabs.update({
            url: classeUrl
          });
          setTimeout(() => {
            window.close();
          }, 500);
        });
      }
    }
  }
);