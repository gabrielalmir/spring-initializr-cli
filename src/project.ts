import AdmZip from "adm-zip";
import axios from "axios";
import fs from "fs-extra";
import path from "path";

export async function generateProject(
    params: URLSearchParams,
    outputDir: string,
    filename: string
) {
    const response = await axios.get(`https://start.spring.io/starter.zip?${params}`, {
        responseType: "arraybuffer",
    });

    if (response.status !== 200) {
        throw new Error(`Failed to generate project: ${response.statusText}`);
    }

    const outputPath = path.join(outputDir, filename);
    await fs.writeFile(outputPath, response.data);
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
