const Metalsmith = require('metalsmith')
const async = require('async')
const inquirer = require('inquirer')
const render = require('consolidate').handlebars.render

function template(files, metalsmith, done){
    var keys = Object.keys(files)
    var metadata = metalsmith.metadata()

    async.each(keys, run, done)

    function run(file, done) {
        var str = files[file].contents.toString()
        render(str, metadata, function(err, res) {
            if (err) return done(err)
            files[file].contents = Buffer.from(res)
            done()
        })
    }
}

function ask(files, metalsmith, done) {
    var prompts = [{
            type: 'input',
            message: 'Project name',
            name: 'name'
        }, {
            type: 'input',
            message: 'AppId',
            name: 'appid'
        }, {
            type: 'input',
            message: 'Project Description',
            name: 'description'
        }, {
            type: 'input',
            message: 'Author',
            name: 'author'
        }]

    var metadata = metalsmith.metadata()

    async.eachSeries(prompts, run, done)

    function run(prompt, done) {
        inquirer
            .prompt([prompt])
            .then(function (answers) {
                let answer = answers[prompt.name]
                metadata[prompt.name] = prompt.type === 'comfirm' ?
                    answer ? 'true' : 'false'
                    : answer
                done()
            }).catch(function(err) {
                done(err)
            })
    }
}

function generate(to, templatePath, done) {
    const metalsmith = Metalsmith(__dirname)
        .source(templatePath)
        .destination(to)
        .use(ask)
        .use(template)
        .build(done)
}

module.exports = generate