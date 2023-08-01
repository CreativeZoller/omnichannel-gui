const url = 'https://bitbucket.org/vertican/omnichannelcommunication-gui/commit/';
const fs = require('fs');
const semver = require('semver');
const child = require('child_process');
const currentChangelog = fs.readFileSync('./CHANGELOG.md', 'utf-8');
const latestTag = child.execSync('git describe --long').toString('utf-8').split('-')[0];
const output = child.execSync(`git log ${latestTag}..HEAD --format=%B%H----DELIMITER----`).toString('utf-8');
let newVersion;
let successInt = 0;

if (fs.existsSync('./package.json')) {
  const package = require('./package.json');
  const currentVersion = package.version;
  let type = process.argv[2];
  if (!['major', 'minor', 'patch'].includes(type)) {
    type = 'patch';
  }

  newVersion = semver.inc(package.version, type);
  package.version = newVersion;
  fs.writeFileSync('./package.json', JSON.stringify(package, null, 2));
  successInt++;

  console.log('Version successfully updated: ', currentVersion, '=>', newVersion);
}

const commitsArray = output
  .split('----DELIMITER----\n')
  .map((commit) => {
    const [message, sha] = commit.split('\n');

    return { sha, message };
  })
  .filter((commit) => Boolean(commit.sha));

let newChangelog = `## Version [${newVersion}] - ${new Date().toISOString().split('T')[0]}\n`;

const chores = [];
const features = [];
const fixes = [];
const documentations = [];
const performance = [];
const refactor = [];
const revert = [];
const style = [];
const test = [];

commitsArray.forEach((commit) => {
  if (commit.message.startsWith('chores: ')) {
    chores.push(`* ${commit.message.replace('chores: ', '')} ([${commit.sha.substring(0, 6)}](url${commit.sha}))\n`);
  }
  if (commit.message.startsWith('feat: ')) {
    features.push(`* ${commit.message.replace('feat: ', '')} ([${commit.sha.substring(0, 6)}](url${commit.sha}))\n`);
  }
  if (commit.message.startsWith('fix: ')) {
    fixes.push(`* ${commit.message.replace('fix: ', '')} ([${commit.sha.substring(0, 6)}](url${commit.sha}))\n`);
  }
  if (commit.message.startsWith('docs: ')) {
    documentations.push(`* ${commit.message.replace('docs: ', '')} ([${commit.sha.substring(0, 6)}](url${commit.sha}))\n`);
  }
  if (commit.message.startsWith('perf: ')) {
    performance.push(`* ${commit.message.replace('perf: ', '')} ([${commit.sha.substring(0, 6)}](url${commit.sha}))\n`);
  }
  if (commit.message.startsWith('refactor: ')) {
    refactor.push(`* ${commit.message.replace('refactor: ', '')} ([${commit.sha.substring(0, 6)}](url${commit.sha}))\n`);
  }
  if (commit.message.startsWith('revert: ')) {
    revert.push(`* ${commit.message.replace('revert: ', '')} ([${commit.sha.substring(0, 6)}](url${commit.sha}))\n`);
  }
  if (commit.message.startsWith('style: ')) {
    style.push(`* ${commit.message.replace('style: ', '')} ([${commit.sha.substring(0, 6)}](url${commit.sha}))\n`);
  }
  if (commit.message.startsWith('test: ')) {
    test.push(`* ${commit.message.replace('test: ', '')} ([${commit.sha.substring(0, 6)}](url${commit.sha}))\n`);
  }
});

if (chores.length) {
  newChangelog += `### Chores\n`;
  chores.forEach((chore) => {
    newChangelog += chore;
  });
  newChangelog += '\n';
}

if (features.length) {
  newChangelog += `### Features\n`;
  features.forEach((feature) => {
    newChangelog += feature;
  });
  newChangelog += '\n';
}

if (fixes.length) {
  newChangelog += `### Fixes\n`;
  fixes.forEach((fix) => {
    newChangelog += fix;
  });
  newChangelog += '\n';
}

if (documentations.length) {
  newChangelog += `### Documentations\n`;
  documentations.forEach((doc) => {
    newChangelog += doc;
  });
  newChangelog += '\n';
}

if (performance.length) {
  newChangelog += `### Performance\n`;
  performance.forEach((perf) => {
    newChangelog += perf;
  });
  newChangelog += '\n';
}

if (refactor.length) {
  newChangelog += `### Refactoring\n`;
  refactor.forEach((refact) => {
    newChangelog += refact;
  });
  newChangelog += '\n';
}

if (revert.length) {
  newChangelog += `### Reverts\n`;
  revert.forEach((rev) => {
    newChangelog += rev;
  });
  newChangelog += '\n';
}

if (style.length) {
  newChangelog += `### Stylings\n`;
  style.forEach((styling) => {
    newChangelog += styling;
  });
  newChangelog += '\n';
}

if (test.length) {
  newChangelog += `### Tests\n`;
  test.forEach((tst) => {
    newChangelog += tst;
  });
  newChangelog += '\n';
}

if (fs.existsSync('./CHANGELOG.md')) {
  fs.writeFileSync('./CHANGELOG.md', `${newChangelog}${currentChangelog}`);
  successInt++;

  console.log('Changelog file generated');
}

if (successInt == 2) {
  child.execSync('git add .');
  child.execSync(`git tag -a -m "Tag for version ${newVersion}" version${newVersion}`);
  child.execSync(`git commit -m "chore: Bump to version ${newVersion}"`);
}
