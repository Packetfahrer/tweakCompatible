const fs = require('fs-extra');
const path = require('path');
var spawn = require('child_process').execFile;
const tweakListPath = path.join(__dirname, "../docs/tweaks.json");
const jsonOutputPath = path.join(__dirname, "../docs/json/");
var jsonOptions = { spaces: 2 };

module.exports.getPackageById = function (id, packages) {
    return packages.find(function (package) {
        return package.id == id;
    });
}

module.exports.findVersionForPackageByOS = function (tweakVersion, iOSVersion, package) {
    return package.versions.find(function(version) {
        return version.tweakVersion == tweakVersion &&
            version.iOSVersion == iOSVersion;
    });
}

module.exports.findReviewForUserInVersion = function (userName, device, version) {
    return version.users.find(function(user) {
        return user.userName == userName &&
            user.device == device;
    });
}

module.exports.commitAgainstIssue = function (issueNumber, callback) {
    var args = ["commit", "-am", "fixes #" + issueNumber]
    var git = spawn("git", args, {
        cwd: path.join(__dirname, "../")
    });
    
    git.on('close', (code) => {
        callback();
    });
}

module.exports.wipeJson = function() {
    fs.emptyDirSync(jsonOutputPath);
}

module.exports.writePackage = function(package, callback) {
    var folder = path.join(jsonOutputPath, "/packages/");
    var file = path.join(folder, package.id + ".json");
    fs.outputJson(file, package, jsonOptions, callback);
}

module.exports.writeByiOS = function (output, iOSVersion, callback) {
    var folder = path.join(jsonOutputPath, "/iOS/");
    var file = path.join(folder, iOSVersion + ".json");
    fs.outputJson(file, output, jsonOptions, callback);
}

module.exports.wipePackages = function () {
    var file = fs.readJsonSync(tweakListPath);
    file.packages = [];
    fs.writeJsonSync(tweakListPath, file, jsonOptions);
}

module.exports.getTweakList = function (callback) {
    fs.readJson(tweakListPath, callback);
}

module.exports.writeTweakList = function (packages, callback) {
    fs.writeJson(tweakListPath, packages, jsonOptions, callback);
}

module.exports.parseJSON = function (str) {
    var json;
    try {
        json = JSON.parse(str);
    } catch (err) { }
    return json;
}
