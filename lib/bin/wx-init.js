const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const inquirer = require('inquirer')



function run(templateName) {
    var template = path.resolve(`../templates/${templateName}`)
    fs.access(template, fs.constants.F_OK, err => {
        if (err) console.log(`${template} not exist!`)
    })
}

module.exports = function(templateName = 'hzf', projectName = '.') {
    var to = path.resolve(projectName)
    var inPlace = !projectName || projectName === '.'
    fs.access(to, fs.constants.F_OK, err => {
        if (err) return run(templateName)
        inquirer.prompt([{
            type: 'confirm',
            message: inPlace ? 'Generate project in current directory?' : 'Target directory exists. Continue?',
            name: 'ok'
        }]).then(function (answers) {
            if (answers.ok) {
                run(templateName)
            }
        }).catch()
    })
}