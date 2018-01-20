(function() {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  const ROW    = 1;
  const COLUMN = 2;

  const copyToClipboard = addresses => {
    const inputElt = document.createElement("textarea");
    document.querySelector("body").appendChild(inputElt);
    inputElt.value = addresses;
    inputElt.select();
    document.execCommand("copy");
    inputElt.remove();
  };

  const copy = (selector, orientation) => {
    const spanElt = document.querySelector(selector);
    const emails = spanElt.getAttribute("data-clipboard-text").replace(/;;+/g, ';');
    if (orientation === COLUMN) {
      copyToClipboard(emails.replace(/\s*;\s*/g, "\n"));
    } else {
      copyToClipboard(emails);
    }
  };

  const copyStudents = (orientation) => {
    console.log("copyStudents");
    copy("#class_members span.clip-paste:nth-child(3)", orientation);
  };

  const copyTeachers = (orientation) => {
    console.log("copyTeacher");
    copy("h3 > span.clip-paste:nth-child(1)", orientation);
  };

  browser.runtime.onMessage.addListener(message => {
    switch (message.command) {
      case 'copyTeachersRow':
        copyTeachers(ROW);
        break;
      case 'copyTeachersColumn':
        copyTeachers(COLUMN);
        break;
      case 'copyStudentsRow':
        copyStudents(ROW);
        break;
      case 'copyStudentsColumn':
        copyStudents(COLUMN);
        break;
      default:
        break;
    }
  });
})();
