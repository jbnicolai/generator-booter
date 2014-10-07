'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var fs = require('fs');

var BooterGenerator = yeoman.generators.Base.extend({
    initializing: function () {
        this.pkg = require('../package.json');
    },

    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to PayteR\'s Booter generator'
        ));

        var prompts = [{
            type: 'input',
            name: 'optionName',
            message: 'What\'s your template name?',
            default: "booter"
        }, {
            type: 'input',
            name: 'optionIP',
            message: 'Choose IP for Vagrant',
            default: "192.168.56.10"
        }, {
            type: 'input',
            name: 'optionDomain',
            message: 'Choose domain for Vagrant',
            default: "booter.dev"
        }];

        this.prompt(prompts, function (props) {
            this.optionName = props.optionName;
            this.optionIP = props.optionIP;
            this.optionDomain = props.optionDomain;

            done();
        }.bind(this));
    },

    writing: {
        assets: function () {
            this.directory('assets', 'assets');
        },
        puphet: function () {
            this.directory('puphpet', 'puphpet');
        },
        projectfiles: function () {
            this.src.copy('bower.json', 'bower.json');
            this.src.copy('.bowerrc', '.bowerrc');
            this.src.copy('.npmignore', '.gitignore');
            this.src.copy('gulpfile.js', 'gulpfile.js');
            this.src.copy('index.html', 'index.html');
            this.src.copy('LICENSE', 'LICENSE');
            this.src.copy('package.json', 'package.json');
            this.src.copy('Vagrantfile', 'Vagrantfile');
        }
    },

    end: function () {
        var oldFile = this.destinationRoot() + "/assets/less/booter/booter.less"
        var newFile = this.destinationRoot() + "/assets/less/booter/" + this.optionName + ".less"
        var oldDir = this.destinationRoot() + "/assets/less/booter"
        var newDir = this.destinationRoot() + "/assets/less/" + this.optionName
        var appLessFile = this.destinationRoot() + "/assets/less/app.less"
        var puphpetConfig = this.destinationRoot() + "/puphpet/config.yaml"
        var that = this

        // rename booter file to project name
        fs.rename(oldFile, newFile, function (err) {
            if (err) throw err;

            // rename booter dir to project dir
            fs.rename(oldDir, newDir, function (err) {
                if (err) throw err;

                // change inport file to project file name
                fs.readFile(appLessFile, 'utf8', function (err, data) {
                    if (err) throw err;

                    data = data.replace(/booter/g, that.optionName)

                    fs.writeFile(appLessFile, data, function (err) {
                        if (err) throw err;
                    });
                })
            });
        });


        // change inport file to project file name
        fs.readFile(puphpetConfig, 'utf8', function (err, data) {
            if (err) throw err;

            data = data.replace(/%option_ip%/g, that.optionIP)
            data = data.replace(/%option_name%/g, that.optionName)
            data = data.replace(/%option_domain%/g, that.optionDomain)

            fs.writeFile(puphpetConfig, data, function (err) {
                if (err) throw err;
            });
        })


        this.installDependencies();
        this.spawnCommand('gulp');
        this.spawnCommand('vagrant up');
        this.spawnCommand('git init');
        this.spawnCommand('git add .');
        this.spawnCommand('git commit -m "init"');

    }
});

module.exports = BooterGenerator;
