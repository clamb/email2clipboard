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

  const getEmails = (selector) => {
    const spanElt = document.querySelector(selector);
    return spanElt.getAttribute("data-clipboard-text").split(/\s*;\s*/);
  };

  const copyStudents = (orientation) => {
    console.log("copyStudents");
    const emailEltSelector = "#class_members span.clip-paste:nth-child(3)";
    copy(emailEltSelector, orientation, getStudentsList);
  }

  const copyTeachers = (orientation) => {
    console.log("copyTeacher");
    const emailEltSelector = "h3 > span.clip-paste:nth-child(1)";
    copy(emailEltSelector, orientation, getTeachersList);
  };

  const copy = (emailSelector, orientation, listcb) => {
    const emails = getEmails(emailSelector);
    console.log(emails);
    if (orientation === ROW) {
      copyToClipboard(emails.join(';'));
    } else {
      let results = '';
      const names = listcb();
      console.log(JSON.stringify(names));
      for (let i = 0, max = emails.length; i < max; i++) {
        results += [names[i].join(';'), emails[i]].join(';') + "\n";
      }
      copyToClipboard(results);
    }
  };

  const getStudentsList = () => {
    var lastnames = [];
    document.querySelectorAll("tr.record > td:nth-child(1) > a")
      .forEach(e => lastnames.push(e.textContent));

    var firstnames = [];
    document.querySelectorAll("tr.record > td:nth-child(2)")
      .forEach(e => firstnames.push(e.textContent));

    var students = [];
    for (let i = 0; i < lastnames.length; i++) {
      students.push([lastnames[i], firstnames[i]]);
    }
    return students;
  }

  const getTeachersList = () => {
    const teachers = [];
    document
      .querySelectorAll(".block > ul:nth-child(2) > li > a > span")
      .forEach(elt => {
        const res = elt.textContent.match(/(^[A-Z\s\-]+?)\s*([A-Z][a-z].*)/);
        if (res !== null) {
          teachers.push([res[1], res[2]]);
        }
      });

    
    return teachers;
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
