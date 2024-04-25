"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFileStructure = void 0;
// TODO: Move out
var FileTypeEnum;
(function (FileTypeEnum) {
    FileTypeEnum["mp4"] = "mp4";
    FileTypeEnum["pdf"] = "pdf";
    FileTypeEnum["downloadable"] = "downloadable";
})(FileTypeEnum || (FileTypeEnum = {}));
function isFileType(value) {
    return value in FileTypeEnum;
}
const viewableFileTypes = ["mp4", "pdf"];
function buildFileStructure(files) {
    const structure = {};
    files.forEach((file) => {
        let parts = file.split("/");
        let current = structure;
        // file = "video/1001 Everyday English Phrases/1. Greetings and social interaction/1. Most Common Greetings.mp4"
        // parts = "video", "1001 Everyday English Phrases", "1. Greetings and social interaction, "1. Most Common Greetings.mp4"
        parts.forEach((part, i) => {
            if (i === parts.length - 1) {
                // last index (file)
                const extension = part.split(".").pop();
                if (!extension) {
                    // TODO: log
                    console.log(`Unable to read ${part} file type`);
                    return;
                }
                if (viewableFileTypes.includes(extension)) {
                    current[part] = extension;
                }
                else {
                    current[part] = FileTypeEnum.downloadable;
                }
            }
            else {
                current[part] = current[part] || {};
                current = current[part];
            }
        });
    });
    return structure;
}
exports.buildFileStructure = buildFileStructure;
//# sourceMappingURL=index.js.map