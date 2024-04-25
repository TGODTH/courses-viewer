import fs from "fs";
interface IFileStructure {
  [key: string]: IFileStructure | string | null;
}

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
        current[part] = extension || null;
      } else {
        current[part] = current[part] || {};
        current = current[part] as IFileStructure;
      }
    });
  });
  return structure;
}
