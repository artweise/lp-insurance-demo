const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

// helpers
handlebars.registerHelper('eq', (a, b) => a === b);

const SRC = path.join(__dirname, '..', 'src');
const DIST = path.join(__dirname, '..', 'dist');

// 1) partials
const partialsDir = path.join(SRC, 'partials');
if (fs.existsSync(partialsDir)) {
  fs.readdirSync(partialsDir).forEach((file) => {
    if (file.endsWith('.hbs')) {
      const name = path.basename(file, '.hbs');
      const tpl = fs.readFileSync(path.join(partialsDir, file), 'utf8');
      handlebars.registerPartial(name, tpl);
    }
  });
}

// 2) prepare dist
if (!fs.existsSync(DIST)) {
  fs.mkdirSync(DIST, { recursive: true });
}
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
fs.mkdirSync(path.join(DIST, 'assets', 'images'), { recursive: true });
fs.mkdirSync(path.join(DIST, 'scripts'), { recursive: true });

// 3) data
const dataPath = path.join(SRC, 'data', 'insurance.json');
const data = fs.existsSync(dataPath)
  ? JSON.parse(fs.readFileSync(dataPath, 'utf8'))
  : {};

// 4) compile pages
const pagesDir = path.join(SRC, 'pages');
fs.readdirSync(pagesDir).forEach((file) => {
  if (file.endsWith('.hbs')) {
    const tplStr = fs.readFileSync(path.join(pagesDir, file), 'utf8');
    const tpl = handlebars.compile(tplStr);
    const html = tpl({ ...data, buildTime: new Date().toISOString() });
    fs.writeFileSync(
      path.join(DIST, file.replace('.hbs', '.html')),
      html,
      'utf8'
    );
  }
});

// 5) copy assets
const imagesSrc = path.join(SRC, 'assets', 'images');
if (fs.existsSync(imagesSrc)) {
  fs.readdirSync(imagesSrc).forEach((f) => {
    const srcFile = path.join(imagesSrc, f);
    const destFile = path.join(DIST, 'assets', 'images', f);
    if (
      !fs.existsSync(destFile) ||
      fs.statSync(srcFile).mtime > fs.statSync(destFile).mtime
    ) {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

// 6) copy our app script
const appScriptSrc = path.join(SRC, 'scripts', 'app.alpine.js');
const appScriptDest = path.join(DIST, 'scripts', 'app.alpine.js');
if (
  !fs.existsSync(appScriptDest) ||
  fs.statSync(appScriptSrc).mtime > fs.statSync(appScriptDest).mtime
) {
  fs.copyFileSync(appScriptSrc, appScriptDest);
}

// 7) copy Alpine (npm → dist)
const alpineCdnBuild = require.resolve('alpinejs/dist/cdn.min.js');
const alpineDest = path.join(DIST, 'scripts', 'alpine.min.js');
if (!fs.existsSync(alpineDest)) {
  fs.copyFileSync(alpineCdnBuild, alpineDest);
}

console.log('Build done.');
