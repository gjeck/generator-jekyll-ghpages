# generator-jekyll-ghpages
[![Build Status](https://travis-ci.org/gjeck/generator-jekyll-ghpages.svg?branch=master)](https://travis-ci.org/gjeck/generator-jekyll-ghpages)

> [Yeoman](http://yeoman.io) generator

## What is this balderdash?

This project is still under development. The project goal is to create a very simple
generator for use on github pages for user, organization, or project sites. The
generator will be a vanilla jekyll install with a light gulp managed front end.

## Getting Started

### Dependencies

Yeoman is the main thing needed. To install run:
```bash
npm install -g yo
```

In addition you'll need `ruby` and `bundler`

### This Generator

To install generator-jekyll-ghpages from npm, run:
```bash
npm install -g generator-jekyll-ghpages
```

Finally, initiate the generator:
```bash
yo jekyll-ghpages
```

## Contributing

To run tests run:
```bash
npm test
```

It can be helpful to install and run integration tests on the package locally. To do so run:
```bash
npm pack
```
This will generate a `.tgz` file which can then be installed by running:
```bash
npm install path/to/package.tgz
```

## License

MIT
