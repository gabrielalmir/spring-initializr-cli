import fs from "fs-extra";
import path from "path";

export async function cleanUp(filePath: string) {
    await fs.remove(filePath);
};

export function resolveOutputDir(outputDir: string): string {
    return path.resolve(outputDir || process.cwd());
};
