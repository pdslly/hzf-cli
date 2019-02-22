const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const inquirer = require('inquirer')
const generate = require('../cli/generate')


module.exports = function(projectName = '.') {
    var to = path.resolve(projectName)
    var inPlace = !projectName || projectName === '.'

    function choiceTemplate() {
        inquirer.prompt([{
            type: 'list',
            message: 'Please select project template',
            name: 'template',
            choices: ['hzf', 'saas']
        }]).then(function (answers) {
            run(answers.template)
        }).catch()
    }

    function run(templateName) {
        var template = path.resolve(__dirname, `../templates/${templateName}`)
        fs.access(template, fs.constants.F_OK, err => {
            if (err) {
                console.log(chalk.red(`-ERR: [${templateName}]模板不存在! 请联系开发者添加！`))
                process.exit(2)
            }
            generate(to, template, err => {
                console.log()
                if (err) {
                    console.log(chalk.red(`-ERR: 生成模板失败！${err}`))
                    process.exit(2)
                }
                console.log(chalk.green(`Generated ${projectName} success!`))
            })
        })
    }

    fs.access(to, fs.constants.F_OK, err => {
        if (err) {
            fs.mkdir(to, err => {
                if (err) {
                    console.log(chalk.red(`-ERR: 创建[${to}]文件失败! ${err.message}`))
                    process.exit(2)
                }
                choiceTemplate()
            })
            return false
        }
        inquirer.prompt([{
            type: 'confirm',
            message: inPlace ? 'Generate project in current directory?' : 'Target directory exists. Continue?',
            name: 'ok'
        }]).then(function (answers) {
            if (answers.ok) choiceTemplate()
        }).catch()
    })
}