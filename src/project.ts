import AdmZip from "adm-zip";
import fs from "fs-extra";
import path from "path";

export async function generateProject(
    params: URLSearchParams,
    outputDir: string,
    filename: string
) {
    const response = await fetch(`https://start.spring.io/starter.zip?${params}`);

    if (!response.ok) {
        throw new Error(`Failed to generate project: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const outputPath = path.join(outputDir, filename);
    await fs.writeFile(outputPath, Buffer.from(buffer));
    console.log(`Project saved to: ${outputPath}`);
};

export async function unzipProject(zipPath: string, outputDir: string) {
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(outputDir, true);
};

export async function createFolder(baseDir: string, folderName: string) {
    const folderPath = path.join(baseDir, folderName);
    await fs.ensureDir(folderPath);
    return folderPath;
};
