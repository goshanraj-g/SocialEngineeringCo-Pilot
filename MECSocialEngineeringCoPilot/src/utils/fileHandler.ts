import fs from "fs";
import path from "path";

export class FileHandler {
  public createFile(filePath: string): void {
    const resolvedPath = path.resolve(filePath);
    const directory = path.dirname(resolvedPath);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    if (!fs.existsSync(resolvedPath)) {
      fs.writeFileSync(resolvedPath, "[]", "utf8");
    }
  }

  public readFile(filePath: string): string {
    const resolvedPath = path.resolve(filePath);
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`File not found: ${resolvedPath}`);
    }
    return fs.readFileSync(resolvedPath, "utf8");
  }

  public writeFile(filePath: string, content: string): void {
    const resolvedPath = path.resolve(filePath);
    const directory = path.dirname(resolvedPath);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFileSync(resolvedPath, content, "utf8");
  }

  public updateJSONFile(filePath: string, newData: string[]): void {
    const resolvedPath = path.resolve(filePath);
    this.createFile(resolvedPath);

    const existingData: string[] = JSON.parse(this.readFile(resolvedPath));
    const updatedData = Array.from(new Set([...existingData, ...newData]));

    this.writeFile(resolvedPath, JSON.stringify(updatedData, null, 2));
  }
}
