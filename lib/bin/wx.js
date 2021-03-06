const commander = require('commander');
const chalk = require('chalk')

commander.version(require('../../package.json').version, '-v, --version')

commander.command('init [project-name]')
    .description('generate a new project from a template')
    .action(require('./wx-init'))
    .usage('[project-name]')
    .on('--help', function () {
        console.log()
        console.log('  Example:')
        console.log()
        console.log(chalk.gray('   # create a new project with an official template'))
        console.log('  $ wx init my-project')
        console.log()
    });

commander.parse(process.argv)