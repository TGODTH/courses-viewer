interface IFileStructure {
  [key: string]: IFileStructure | string | null;
}

// TODO: Move out
enum FileTypeEnum {
  mp4 = "mp4",
  pdf = "pdf",
  downloadable = "downloadable",
}
function isFileType(value: string): value is FileTypeEnum {
  return value in FileTypeEnum;
}

const viewableFileTypes = ["mp4", "pdf"];

export function buildFileStructure(files: string[]): IFileStructure {
  const structure: IFileStructure = {};
  files.forEach((file) => {
    let parts: string[] = file.split("/");
    let current: IFileStructure = structure;
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
        } else {
          current[part] = FileTypeEnum.downloadable;
        }
      } else {
        current[part] = current[part] || {};
        current = current[part] as IFileStructure;
      }
    });
  });
  return structure;
}
