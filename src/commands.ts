import { exec } from "child_process";

export const startContainers = async (composeFile: string) => {
    await runCommand(`docker compose --file ${composeFile} up -d`);
}

export const stopContainer = async (serviceName: string, composeFile: string) => {
    await runCommand(`docker compose --file ${composeFile} stop ${serviceName}`);
}

export const restartContainer = async (serviceName: string, composeFile: string) => {
    await runCommand(`docker compose --file ${composeFile} restart ${serviceName}`);
}

export const rebuildImageAndRestartContainer = async (serviceName: string, composeFile: string) => {
    await runCommand(`docker compose --file ${composeFile} stop ${serviceName}`);
    await runCommand(`docker compose --file ${composeFile} build ${serviceName}`);
    await runCommand(`docker compose --file ${composeFile} up -d`);
}

export const rebuildImageAndRestartContainerWithoutCache = async (serviceName: string, composeFile: string) => {
    await runCommand(`docker compose --file ${composeFile} stop ${serviceName}`);
    await runCommand(`docker compose --file ${composeFile} build ${serviceName} --no-cache`);
    await runCommand(`docker compose --file ${composeFile} up -d`);
}

export const getServices = async (composeFile: string) => {
    try {
        const output = await runCommand(`docker compose --file ${composeFile} ps --no-trunc --format json`);
        const parsedOutput = output
            .trim()
            .split("\n")
            .map((line) => JSON.parse(line))
            .map((data) => ({ serviceName: data.Service, status: data.State }));
        return parsedOutput;
    } catch (err) {
        return [];
    }
}

const runCommand = (command: string) => {
    return new Promise<string>((resolve, reject) => {
        exec(command, (error, stdout) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout);
        });
    })
};