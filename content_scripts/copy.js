(function () {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

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

  const copyStudents = (options) => {
    // console.log("copyStudents");
    const emailEltSelector = "#class_members span.clip-paste:nth-child(3)";
    copy(emailEltSelector, getStudentsList, options);
  }

  const copyTeachers = (options) => {
    // console.log("copyTeacher");
    const emailEltSelector = "h3 > span.clip-paste:nth-child(1)";
    copy(emailEltSelector, getTeachersList, options);
  };

  const getData = (names, emails, {
    email,
    fullname,
    lastname,
    firstname,
    acronym
  }) => {
    // console.log(`names: ${JSON.stringify(names)}`);
    // console.log(`emails: ${JSON.stringify(emails)}`);
    const res = [];
    for (let i = 0; i < names.length; i++) {
      const each = [];

      if (fullname) {
        each.push(names[i][0] + ' ' + names[i][1]);
      }

      if (lastname) {
        each.push(names[i][0]);
      }

      if (firstname) {
        each.push(names[i][1]);
      }

      if (email) {
        each.push(emails[i].toLowerCase());
      }

      if (acronym) {
        each.push(names[i][2]);
      }

      res.push(each);
    }

    // console.log(`res: ${JSON.stringify(res)}`);
    return res;
  };

  const copy = (emailSelector, listcb, options) => {
    // console.log(`options: ${JSON.stringify(options)}`);
    const emails = getEmails(emailSelector);
    const names = listcb();

    const data = getData(names, emails, options)

    let results = '';

    data.forEach(rec => {
      results += rec.join(options.fieldSeparator) + options.recordSeparator;
    });

    // console.log(`results:\n<${results}>`);
    copyToClipboard(results);
  };

  const getStudentsList = () => {
    // querySelectorAll returns a NodeList that does not support map.
    const lastnames = [];
    document
      .querySelectorAll("tr.record > td:nth-child(1) > a")
      .forEach(e => lastnames.push(e.textContent));

    const firstnames = [];
    document
      .querySelectorAll("tr.record > td:nth-child(2)")
      .forEach(e => firstnames.push(e.textContent));

    const students = [];
    for (let i = 0; i < lastnames.length; i++) {
      const acronym = `${firstnames[i].toLowerCase()}_${lastnames[i].toLowerCase()}`;
      students.push([lastnames[i], firstnames[i], acronym]);
    }

    return students;
  }

  const getTeachersList = () => {
    const names = [];
    document
      .querySelectorAll(".block > ul:nth-child(2) > li > a > span")
      .forEach(elt => {
        const res = elt.textContent.match(/(^[A-Z\s\-]+?)\s*([A-Z][a-z\u00C0-\u00FF].*)/u);
        if (res !== null) {
          names.push([res[1], res[2]]);
        }
      });

    const acronyms = [];
    document
      .querySelectorAll(".block > ul:nth-child(2) > li > a.resource")
      .forEach(elt => {
        acronyms.push(elt.getAttribute('href').split('/').pop());
      });

    const teachers = [];
    for (let i = 0; i < names.length; i++) {
      teachers.push([...names[i], acronyms[i]]);
    }
    return teachers;
  };

  browser.runtime.onMessage.addListener(({
    command,
    options
  }) => {
    // console.log(`command: ${command}`);
    // console.log(`options: ${JSON.stringify(options)}`);
    if (options.email || options.fullname || options.lastname || options.acronym) {
      switch (command) {
        case 'copyTeachers':
          copyTeachers(options);
          break;
        case 'copyStudents':
          copyStudents(options);
          break;
        default:
          break;
      }
    }
  });
})();