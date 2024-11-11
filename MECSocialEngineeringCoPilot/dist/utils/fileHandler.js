"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHandler = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class FileHandler {
    createFile(filePath) {
        const resolvedPath = path_1.default.resolve(filePath);
        const directory = path_1.default.dirname(resolvedPath);
        if (!fs_1.default.existsSync(directory)) {
            fs_1.default.mkdirSync(directory, { recursive: true });
        }
        if (!fs_1.default.existsSync(resolvedPath)) {
            fs_1.default.writeFileSync(resolvedPath, "[]", "utf8");
        }
    }
    readFile(filePath) {
        const resolvedPath = path_1.default.resolve(filePath);
        if (!fs_1.default.existsSync(resolvedPath)) {
            throw new Error(`File not found: ${resolvedPath}`);
        }
        return fs_1.default.readFileSync(resolvedPath, "utf8");
    }
    writeFile(filePath, content) {
        const resolvedPath = path_1.default.resolve(filePath);
        const directory = path_1.default.dirname(resolvedPath);
        if (!fs_1.default.existsSync(directory)) {
            fs_1.default.mkdirSync(directory, { recursive: true });
        }
        fs_1.default.writeFileSync(resolvedPath, content, "utf8");
    }
    updateJSONFile(filePath, newData) {
        const resolvedPath = path_1.default.resolve(filePath);
        this.createFile(resolvedPath);
        const existingData = JSON.parse(this.readFile(resolvedPath));
        const updatedData = Array.from(new Set([...existingData, ...newData]));
        this.writeFile(resolvedPath, JSON.stringify(updatedData, null, 2));
    }
}
exports.FileHandler = FileHandler;
