const inquirer = require("inquirer");
const fs = require("fs");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");

const employees = [];

function initApp() {
  startHtml();
  addMember();
}

function addMember() {
  inquirer
    .prompt([
      {
        message: "Enter team member's name",
        name: "name",
      },
      {
        type: "list",
        message: "Select team member's role",
        choices: ["Engineer", "Intern", "Manager"],
        name: "role",
      },
      {
        message: "Enter team member's id",
        name: "id",
      },
      {
        message: "Enter team member's email address",
        name: "email",
      },
    ])
    .then(function ({ name, role, id, email }) {
      let roleInfo = "";
      if (role === "Engineer") {
        roleInfo = "GitHub username";
      } else if (role === "Intern") {
        roleInfo = "school name";
      } else {
        roleInfo = "office phone number";
      }
      inquirer
        .prompt([
          {
            message: `Enter team member's ${roleInfo}`,
            name: "roleInfo",
          },
          {
            type: "list",
            message: "Would you like to add more team members?",
            choices: ["yes", "no"],
            name: "moreMembers",
          },
        ])
        .then(function ({ roleInfo, moreMembers }) {
          let newMember;
          if (role === "Engineer") {
            newMember = new Engineer(name, id, email, roleInfo);
          } else if (role === "Intern") {
            newMember = new Intern(name, id, email, roleInfo);
          } else {
            newMember = new Manager(name, id, email, roleInfo);
          }
          employees.push(newMember);
          addHtml(newMember).then(function () {
            if (moreMembers === "yes") {
              addMember();
            } else {
              finishHtml();
            }
          });
        });
    });
}

function startHtml() {
  const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <link rel="stylesheet" href="./style.css">
        <title>Team Profile Generator</title>
    </head>
    <body>
                 <header>
                <nav class="navbar bg-danger text-white">
                    <span class="navbar-brand mb-0 h1 w-100 text-center" id="navbar-text">Team Profile</span>
                </nav>
            </header>
            <div class="container">
            <div class="row">
            `;
  fs.writeFile("./dist/team.html", html, function (err) {
    if (err) {
      console.log(err);
    }
  });
  console.log("start");
}

function addHtml(member) {
  return new Promise(function (resolve, reject) {
    const name = member.getName();
    const role = member.getRole();
    const id = member.getId();
    const email = member.getEmail();
    let data = "";
    if (role === "Engineer") {
      const gitHub = member.getGithub();
      data = `<div class="card employee-card">
                        <div class="card-header">
                            <h2 class="card-title">${name}</h2>
                            <h3 class="card-title"><i class="fas fa-glasses mr-2"></i>Engineer</h3>
                        </div>
                        <div class="card-body">
                            <ul class="list-group">
                                <li class="list-group-item">ID: ${id}</li>
                                <li class="list-group-item">Email: ${email}</li>
                                <li class="list-group-item">GitHub: ${gitHub}</li>
                            </ul>
                        </div>
                    </div>`;
    } else if (role === "Intern") {
      const school = member.getSchool();
      data = `<div class="card employee-card">
                        <div class="card-header">
                            <h2 class="card-title">${name}</h2>
                            <h3 class="card-title"><i class="fas fa-user-graduate mr-2"></i>Intern</h3>
                        </div>
                        <div class="card-body">
                            <ul class="list-group">
                                <li class="list-group-item">ID:${id}</li>
                                <li class="list-group-item">Email:${email}</li>
                                <li class="list-group-item">School:${school}</li>
                            </ul>
                        </div>
                    </div>`;
    } else {
      const officePhone = member.getOfficeNumber();
      data = `<div class="card employee-card">
            <div class="card-header">
                            <h2 class="card-title">${name}</h2>
                            <h3 class="card-title"><i class="fas fa-mug-hot mr-2"></i>Manager</h3>
                        </div>
                        <div class="card-body">
                            <ul class="list-group">
                                <li class="list-group-item">ID:${id}</li>
                                <li class="list-group-item">Email: ${email}</li>
                                <li class="list-group-item">Office phone: ${officePhone}</li>
                            </ul>
                        </div>
                    </div>`;
    }
    console.log("adding team member");
    fs.appendFile("./dist/team.html", data, function (err) {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

function finishHtml() {
  const html = `</div>
  </div>
  </body>
</html>`;

  fs.appendFile("./dist/team.html", html, function (err) {
    if (err) {
      console.log(err);
    }
  });
  console.log("end");
}

initApp();
