export interface Metadata {
    dependencies: {
        values: { name: string; values: { id: string; name: string }[] }[];
    };
    type: { default: string; values: { id: string; name: string }[] };
    javaVersion: { default: string; values: { id: string; name: string }[] };
    bootVersion: { default: string; values: { id: string; name: string }[] };
    language: { default: string; values: { id: string; name: string }[] };
    packaging: { default: string; values: { id: string; name: string }[] };
}

export async function fetchMetadata(): Promise<Metadata> {
    const response = await fetch("https://start.spring.io", {
        headers: { Accept: "application/vnd.initializr.v2.2+json" },
    });

    return response.json();
};
