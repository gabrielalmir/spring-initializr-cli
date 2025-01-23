import { checkbox, input, select } from "@inquirer/prompts";
import path from "path";
import { fetchMetadata, Metadata } from "./metadata";
import { createFolder, generateProject, unzipProject } from "./project";
import { cleanUp, resolveOutputDir } from "./utils";

async function main() {
    console.log("🔄 Fetching Spring Initializr metadata...");
    let metadata: Metadata;

    try {
        metadata = await fetchMetadata();
        console.log("✅ Metadata loaded!");
    } catch (error) {
        console.error("❌ Failed to fetch metadata:", error);
        process.exit(1);
    }

    const type = await select({
        message: "Select Project Type:",
        choices: metadata.type.values.map((type) => ({ name: type.name, value: type.id })),
        default: metadata.type.default,
    });

    const language = await select({
        message: "Select Language:",
        choices: metadata.language.values.map((lang) => ({ name: lang.name, value: lang.id })),
        default: metadata.language.default,
    });

    const bootVersion = await select({
        message: "Select Spring Boot Version:",
        choices: metadata.bootVersion.values.map((version) => ({ name: version.name, value: version.id })),
        default: metadata.bootVersion.default,
    });

    const groupId = await input({ message: "Enter Group ID:", default: "com.example" });
    const artifactId = await input({ message: "Enter Artifact ID:", default: "demo" });
    const name = await input({ message: "Enter Project Name:", default: "demo" });
    const description = await input({ message: "Enter Project Description:", default: "Demo project for Spring Boot" });
    const packageName = await input({ message: "Enter Package Name:", default: `${groupId}.${artifactId}` });

    const packaging = await select({
        message: "Select Packaging Type:",
        choices: metadata.packaging.values.map((pack) => ({ name: pack.name, value: pack.id })),
        default: metadata.packaging.default,
    });

    const javaVersion = await select({
        message: "Select Java Version:",
        choices: metadata.javaVersion.values.map((version) => ({ name: version.name, value: version.id })),
        default: metadata.javaVersion.default,
    });

    const dependencies = await checkbox({
        message: "Select Dependencies:",
        choices: metadata.dependencies.values.flatMap((group) =>
            group.values.map((dep) => ({ name: `${group.name}: ${dep.name}`, value: dep.id }))
        ),
        pageSize: 20,
    });

    const outputDir = await input({
        message: "Enter Output Directory:",
        default: resolveOutputDir(process.cwd()),
    });

    const params = new URLSearchParams({
        type,
        language,
        bootVersion,
        groupId,
        artifactId,
        name,
        description,
        packageName,
        packaging,
        javaVersion,
        dependencies: dependencies.join(","),
    });

    try {
        console.log("🔄 Generating project...");
        const zipFileName = `${artifactId}.zip`;
        await generateProject(params, outputDir, zipFileName);

        console.log("🔄 Extracting project...");
        const projectDir = await createFolder(outputDir, artifactId);
        await unzipProject(path.join(outputDir, zipFileName), projectDir);

        console.log("🔄 Cleaning up...");
        await cleanUp(path.join(outputDir, zipFileName));

        console.log("✅ Project generated successfully!");
    } catch (error) {
        console.error("❌ Failed to generate project:", error);
    }
}

main()
    .catch((error) => {
        if (error.name === "ExitPromptError") {
            console.log("❌ Exiting...");
            process.exit(0);
        }

        console.error("❌ An error occurred:", JSON.stringify(error));
    });
