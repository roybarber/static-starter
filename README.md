# Damage - Static Starter

**Speed up your development with a complete and scalable gulpjs based build system that scaffolds the project for you. Just focus on your code.**
[View Demo](http://static-starter.netlify.com/)
***

### Getting started

Install **node.js**. Then **gulp** and **bower** if you haven't yet.

    $ npm -g install gulp bower

After that, install the [We Are Damage](https://wearedamage.com) static-starter by downloading the [master release](https://github.com/wearedamage/static-starter/archive/master.zip) (or clone the master branch).

    $ git clone git@github.com:wearedamage/static-starter.git
    $ cd static-starter

Install bower and npm dependencies, and run your code in development mode.

    $ npm install
    $ bower install
    $ gulp serve

You are now ready to go, your code is available at **http://localhost:3000**.

**Every file you add, edit or delete into the `/client` folder will be handled by the build system**.

When you are ready to build a production release there is a task for that:

    $ gulp serve:dist

This task will lint your code, optimize css js and images files. After the task has successfully finished, you can find an optimized version of your project inside the  `/build/dist` folder.

### Features

* Very fast
* 2 simple task for development & build: `gulp serve`,`gulp serve:dist`
* SASS continuous compiling.
* Livereload provided by [browsersync](http://www.browsersync.io/).
* Static resources minification and optimization for production.

### Directory Structure

* `build/` - Build files and configuration, the most important file to note is `build.config.js`
* `client/` the source code, take a look at the modules in this folder, you should structure your application following those conventions, but you can choose another convention as well.
* `.bowerrc` - the bower configuration file. This tells Bower to install components in the `client/vendor` directory.
* `gulpfile` - see [The Build System](#thebuildsystem) below.
* `bower.json` - Contains the list of bower front end dependencies.
* `package.json` - node.js dependencies.

### <a name="thebuildsystem"></a>The Build System

There are some `tasks` available in `gulpfile.js`. You can dig into the file to familiarize yourself with gulpjs.

A description of every available task:

* **gulp serve** - When this task runs, the build will take care of watching files. Every time you change a file in the `client/` folder, the build recompiles every file, and your browser will reload automagically showing you the changes.
You just need to add new JavaScript and css files in the `client/index.html` file.
* **gulp serve:dist** - This task will create a fully-optimized version of your code under the `build/dist/` folder. The optimization consists of concatenate, minify and compress js and css files and finally optimize all images.
