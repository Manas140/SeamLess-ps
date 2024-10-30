#target photoshop;

var params = new Object();

params["useOpen"] = true;
params["source"] = [];

params["roughHeight"] = 5000;
params["absolute"] = false;
params["skipStep"] = 10;
params["neighborCount"] = 5;
params["threshold"] = 50;

params["sameOutput"] = true;
params["output"] = [];

params["exportQual"] = 9;
params["exportFormat"] = "png";

// Function to create and run a batch file with a pause
function runCommand(cmd, isWindows) {
    var script = isWindows ? "/run.bat" : "/run.sh";
    var tempSh = new File(Folder.temp + script);

    tempSh.open("w");

    if (isWindows) {
        tempSh.writeln("@echo off");
        tempSh.writeln(cmd);
        tempSh.writeln("echo.");
        tempSh.writeln("pause");
    } else {
        return;
        // WIP
        tempSh.writeln(cmd);
        tempSh.writeln("read -s -k $'?Press any key to continue.'");
    }
    // Open the file for writing

    tempSh.close();
    tempSh.execute();

    callback();
}

function createDialog() {
    var d = new Window('dialog', 'SeamLESS v0.2 - A Smart Stitch Utility By Silly Guy');

    var borderProperty = new Object();
    borderProperty["borderStyle"] = 'topDivider';

    d.mainGroup = d.add('group');
    d.mainGroup.orientation = 'column';
    d.mainGroup.alignment = 'fill';
    d.mainGroup.alignChildren = 'fill';
    d.mainGroup.spacing = 10;

    d.mainGroup.step = d.mainGroup.add('group');
    d.mainGroup.step.orientation = 'row';
    d.mainGroup.step.alignment = 'left';
    d.mainGroup.step.alignChildren = 'left';

    // Part 1
    d.icnOne = d.mainGroup.step.add('image', undefined, 'Step1Icon');
    d.txtOne = d.mainGroup.step.add('statictext', undefined, "Select images to process");

    d.mainGroup.step.sourceOpt = d.mainGroup.add('group');
    d.mainGroup.step.sourceOpt.margins = [30, 0, 0, 0];
    d.mainGroup.step.sourceOpt.orientation = 'column';
    d.mainGroup.step.sourceOpt.alignChildren = 'left';
    d.mainGroup.step.sourceOpt.alignment = 'left';

    d.useOpenBtn = d.mainGroup.step.sourceOpt.add('radiobutton', undefined, 'Use open');
    d.useOpenBtn.value = params["useOpen"];

    d.selectSourceRadio = d.mainGroup.step.sourceOpt.add('radiobutton', undefined, 'Use a folder');

    d.mainGroup.step.sourceOpt.selectSource = d.mainGroup.step.sourceOpt.add('group');

    d.selectSourceBtn = d.mainGroup.step.sourceOpt.selectSource.add('button', undefined, 'Select Input Folder');
    d.sourceText = d.mainGroup.step.sourceOpt.selectSource.add('statictext', undefined, params['source'] ? params['source'] : 'No folder selected', { characters: 50 });
    d.sourceText.preferredSize.width = 400

    d.mainGroup.step.sourceOpt.selectSource.enabled = false;
    d.mainGroup.add('panel', undefined, undefined, borderProperty)

    // part 2
    d.mainGroup.step2 = d.mainGroup.add('group');
    d.mainGroup.step2.orientation = 'row';
    d.mainGroup.step2.alignment = 'left';

    d.icnTwo = d.mainGroup.step2.add('image', undefined, 'Step2Icon');
    d.txtTwo = d.mainGroup.step2.add('statictext', undefined, "Configure Settings");

    d.mainGroup.step2.settingsPane = d.mainGroup.add('group');
    d.mainGroup.step2.settingsPane.margins = [30, 0, 0, 0];
    d.mainGroup.step2.settingsPane.orientation = 'column';
    d.mainGroup.step2.settingsPane.alignChildren = 'left';
    d.mainGroup.step2.settingsPane.alignment = 'left';

    d.absoluteBtn = d.mainGroup.step2.settingsPane.add('checkbox', undefined, 'Use Absolute Height');

    d.optsGroup = d.mainGroup.step2.settingsPane.add('group');
    d.optsGroup.orientation = 'row';
    d.optsGroup.alignChildren = 'left';
    d.optsGroup.alignment = 'left';

    d.heightText = d.optsGroup.add('statictext', undefined, "Rough Height");
    d.heightText.preferredSize.width = 70;

    d.roughHeight = d.optsGroup.add('edittext', undefined, params["roughHeight"])
    d.roughHeight.preferredSize.width = 50;

    d.skipStepText = d.optsGroup.add('statictext', undefined, "Skip Step");
    d.skipStep = d.optsGroup.add('edittext', undefined, params["skipStep"])
    d.skipStep.preferredSize.width = 50;

    d.thresholdText = d.optsGroup.add('statictext', undefined, "Threshold");
    d.threshold = d.optsGroup.add('edittext', undefined, params["threshold"])
    d.threshold.preferredSize.width = 50;

    d.neighborCountText = d.optsGroup.add('statictext', undefined, "Neighbor Count");
    d.neighborCount = d.optsGroup.add('edittext', undefined, params["neighborCount"])
    d.neighborCount.preferredSize.width = 50;

    // P2 params init 
    d.absoluteBtn.value = params["absolute"];
    d.heightText.text = params["absolute"] ? "Height" : "Rough Height";
    d.thresholdText.enabled = !params["absolute"];
    d.skipStepText.enabled = !params["absolute"];
    d.neighborCountText.enabled = !params["absolute"];
    d.threshold.enabled = !params["absolute"];
    d.skipStep.enabled = !params["absolute"];
    d.neighborCount.enabled = !params["absolute"];

    d.mainGroup.add('panel', undefined, undefined, borderProperty)

    // part 3
    d.mainGroup.step3 = d.mainGroup.add('group');
    d.mainGroup.step3.orientation = 'row';
    d.mainGroup.step3.alignment = 'left';

    d.icnTwo = d.mainGroup.step3.add('image', undefined, 'Step3Icon');
    d.txtTwo = d.mainGroup.step3.add('statictext', undefined, "Export Settings");

    d.mainGroup.step3.exportOpt = d.mainGroup.add('group');
    d.mainGroup.step3.exportOpt.margins = [30, 0, 0, 0];
    d.mainGroup.step3.exportOpt.orientation = 'column';
    d.mainGroup.step3.exportOpt.alignChildren = 'left';
    d.mainGroup.step3.exportOpt.alignment = 'left';

    d.sameOutputRadio = d.mainGroup.step3.exportOpt.add('radiobutton', undefined, 'Use current folder');
    params["sameOutput"] = !app.activeDocument.fsName ? params["sameOutput"] : false;

    d.sameOutputRadio.value = params["sameOutput"];
    d.sameOutputRadio.enabled = !app.activeDocument.fsName;

    d.useOutputFolderRadio = d.mainGroup.step3.exportOpt.add('radiobutton', undefined, 'Use different folder');
    d.useOutputFolderRadio.value = !params["sameOutput"];

    d.mainGroup.step3.exportOpt.selectOutputDir = d.mainGroup.step3.exportOpt.add('group');

    d.selectOutputBtn = d.mainGroup.step3.exportOpt.selectOutputDir.add('button', undefined, 'Select Output Folder');
    d.outputDirText = d.mainGroup.step3.exportOpt.selectOutputDir.add('statictext', undefined, params['output'] ? params['output'] : 'No Output folder selected', { characters: 50 });
    d.outputDirText.preferredSize.width = 400
    d.mainGroup.step3.exportOpt.selectOutputDir.enabled = !params["sameOutput"];

    d.mainGroup.add('panel', undefined, undefined, borderProperty)
    d.mainGroup.add('statictext', undefined, "Report any errors at: https://github.com/manas140/SeamLess-ps")

    // part 4
    d.actionGroup = d.add('group');
    d.actionGroup.spacing = 0;
    d.actionGroup.alignment = 'right';
    d.actionGroup.orientation = 'row';

    d.mergeBtn = d.actionGroup.add('button', undefined, 'Merge');
    d.sliceBtn = d.actionGroup.add('button', undefined, 'Slice && Export');
    d.stitchBtn = d.actionGroup.add('button', undefined, 'Stitch && Export');
    d.closeBtn = d.actionGroup.add('button', undefined, 'Cancel');

    return d;
}

function merge() {
    var docs = [];
    if (params['useOpen']) {
        for (var i = 0; i < app.documents.length; i++) {
            docs.push(app.documents[i]);
        }
    }
    else {
        var files = params["source"].getFiles(/\.(jpg|jpeg|png|tif|tiff|psd|bmp)$/i);

        if (files.length === 0) {
            alert("Source has no documents to process.");
            return;
        }

        for (var j = 0; j < files.length; j++) {
            try {
                var doc = open(files[j]);
                docs.push(doc);
            } catch (e) {
                alert("Error opening file: " + files[j].name + "\n" + e.message);
            }
        }
    }


    docs.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });

    var docCount = docs.length;

    if (docCount <= 1) {
        alert("Less than ONE document to process!");
        return;
    }

    var minWidth = 0;
    var totalHeight = 0;
    var maxRes = 0;

    for (var i = 0; i < docCount; i++) {
        var doc = docs[i];
        maxRes = Math.max(maxRes, doc.resolution);
        minWidth = i < 1 ? doc.width.as('px') : Math.min(minWidth, doc.width.as('px'));
        totalHeight += doc.height.as('px');
    }
    var mergedDoc = app.documents.add(minWidth, totalHeight, maxRes, "Merged Document", NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
    var yOffset = 0;

    var height;

    for (var i = 0; i < docCount; i++) {

        var doc = docs[i];
        var height = doc.height.as('px');
        app.activeDocument = doc;

        var temp = doc.duplicate();
        temp.flatten();

        if (temp.width.as('px') != minWidth) {
            var scaleFactor = minWidth / temp.width.as('px');
            height = temp.height.as('px') * scaleFactor;
            temp.resizeImage(minWidth, height, maxRes);
        }

        temp.selection.selectAll();
        temp.selection.copy();
        temp.close(SaveOptions.DONOTSAVECHANGES);

        app.activeDocument = mergedDoc;

        var pastedLayer = mergedDoc.paste();
        pastedLayer.name = doc.name;

        pastedLayer.translate(0, ((height - mergedDoc.height.as('px')) / 2) + yOffset);

        yOffset += height;
    }

    mergedDoc.crop([0, 0, minWidth, yOffset])
    return mergedDoc;
}

function slice(doc) {
    if (!params["output"].fsName) {
        alert("Please select an output folder before proceeding.");
        return;
    }

    var rh = Number(params["roughHeight"]);
    if (rh >= doc.height.as('px')) {
        alert("Skipping... Image height is smaller than rough height.");
        return;
    }

    var pngSaveOptions = new PNGSaveOptions();
    pngSaveOptions.compression = 9;

    // Save as temp file
    var saveFile = new File(Folder.temp + "/" + "merged.png");
    doc.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE);

    // Define script and command parameters
    var scriptFolder = new Folder($.fileName).parent;

    var isWindows = $.os.toLowerCase().indexOf("windows") >= 0;
    var scriptFile = new File(scriptFolder + (isWindows ? "/slice.exe" : "/slice"));

    var th = params["threshold"];
    var ss = params["skipStep"];
    var nc = params["neighborCount"];

    var cmd = isWindows ? "\"" + scriptFile.fsName + "\"" + " \"" + saveFile.fsName + "\" " + rh + " " + th + " " + ss + " " + nc + " \"" + params["output"].fsName + "\" " + (params["absolute"] ? "true" : "false") :
        "./" + scriptFile.fsName + " \"" + saveFile.fsName + "\" " + rh + " " + th + " " + ss + " " + nc + " \"" + params["output"].fsName + "\" " + (params["absolute"] ? "true" : "false");
    runCommand(cmd, function () {
        alert("Slices Exported in: " + params["output"].fsName);
    });
}

// Show the dialog
function main() {
    // var params = initParams();
    var window = createDialog();
    app.preferences.rulerUnits = Units.PIXELS;

    // radio handlers
    window.useOpenBtn.onClick = function () {
        params["useOpen"] = window.useOpenBtn.value;
        window.mainGroup.step.sourceOpt.selectSource.enabled = false;
    };
    window.selectSourceRadio.onClick = function () {
        params["useOpen"] = window.useOpenBtn.value;
        window.mainGroup.step.sourceOpt.selectSource.enabled = true;
    }

    window.sameOutputRadio.onClick = function () {
        params["sameOutput"] = window.sameOutputRadio.value;
        window.mainGroup.step3.exportOpt.selectOutputDir.enabled = false;
    };
    window.useOutputFolderRadio.onClick = function () {
        params["sameOutput"] = window.sameOutputRadio.value;
        window.mainGroup.step3.exportOpt.selectOutputDir.enabled = true;
    }

    // opts handler
    window.selectSourceBtn.onClick = function () {
        var selectedFolder = Folder.selectDialog('Select input folder');
        params["source"] = selectedFolder;
        window.sourceText.text = params["source"].fsName;
    };
    window.selectOutputBtn.onClick = function () {
        var selectedFolder = Folder.selectDialog('Select output folder');
        params["output"] = selectedFolder;
        window.outputDirText.text = params["output"].fsName;
    };

    window.absoluteBtn.onClick = function () {
        params["absolute"] = window.absoluteBtn.value;
        window.heightText.text = params["absolute"] ? "Height" : "Rough Height";

        window.thresholdText.enabled = !params["absolute"];
        window.skipStepText.enabled = !params["absolute"];
        window.neighborCountText.enabled = !params["absolute"];

        window.threshold.enabled = !params["absolute"];
        window.skipStep.enabled = !params["absolute"];
        window.neighborCount.enabled = !params["absolute"];
    }

    // handlers
    window.sliceBtn.onClick = function () {
        params["roughHeight"] = window.roughHeight.text;
        params["skipStep"] = window.skipStep.text;
        params["neighborCount"] = window.neighborCount.text;
        params["threshold"] = window.threshold.text;
        slice(app.activeDocument);
    };
    window.mergeBtn.onClick = function () {
        merge();
    };
    window.stitchBtn.onClick = function () {
        if (!params["output"].fsName) {
            alert("Please select an output folder before proceeding.");
            return;
        }
        var mergedDoc = merge();
        slice(mergedDoc);
        window.close();
    };
    window.closeBtn.onClick = function () {
        window.close();
    };

    window.show();
}

main();