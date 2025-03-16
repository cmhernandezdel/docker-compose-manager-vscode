import * as vscode from 'vscode';
import * as cmd from './commands';
import { DockerContainerTreeItem } from './docker-container-tree-item';
import { DockerContainerProvider } from './docker-container-tree-provider';

const containerProvider = new DockerContainerProvider();

// Registering the tree view in `activate` function
export function activate(context: vscode.ExtensionContext) {
  vscode.window.registerTreeDataProvider("docker-compose-manager-view", containerProvider);

  // Refresh command
  context.subscriptions.push(
    vscode.commands.registerCommand("docker-compose-manager.startContainers", async () => {
      try {
        await cmd.startContainers(containerProvider.fileName);
        containerProvider.refresh();
      } catch (err: any) {
        vscode.window.showErrorMessage(err.message);
      }
    }),
    vscode.commands.registerCommand("docker-compose-manager.stopContainer", 
      async (view: DockerContainerTreeItem) => {
        try {
          await cmd.stopContainer(view.containerName, containerProvider.fileName);
          containerProvider.refresh();
        } catch (err: any) {
          vscode.window.showErrorMessage(err.message);
        }
        
      }),
    vscode.commands.registerCommand("docker-compose-manager.restartContainer", 
      async (view: DockerContainerTreeItem) => {
        try {
          await cmd.restartContainer(view.containerName, containerProvider.fileName);
          containerProvider.refresh();
        } catch (err: any) {
          vscode.window.showErrorMessage(err.message);
        }
      }),
    vscode.commands.registerCommand("docker-compose-manager.rebuildAndRestartContainer", 
      async (view: DockerContainerTreeItem) => {
        try {
          await cmd.rebuildImageAndRestartContainer(view.containerName, containerProvider.fileName);
          containerProvider.refresh();
        } catch (err: any) {
          vscode.window.showErrorMessage(err.message);
        }
    }),
    vscode.commands.registerCommand("docker-compose-manager.rebuildAndRestartContainerWithoutCache", 
      async (view: DockerContainerTreeItem) => {
        try {
          await cmd.rebuildImageAndRestartContainerWithoutCache(view.containerName, containerProvider.fileName);
          containerProvider.refresh();
        } catch (err: any) {
          vscode.window.showErrorMessage(err.message);
        }
    }),
    vscode.commands.registerCommand("docker-compose-manager.pickFile", async () => {
      const fileUri = await vscode.window.showOpenDialog({
        canSelectMany: false,
        canSelectFolders: false,
        canSelectFiles: true,
        openLabel: 'Select file',
        filters: {
          'YAML files': ['yaml', 'yml']
        }
      });
      if (fileUri && fileUri[0]) {
        containerProvider.fileName = fileUri[0].fsPath;
        vscode.window.showInformationMessage(`Selected file: ${containerProvider.fileName}`);
      }
    }),
    vscode.commands.registerCommand("docker-compose-manager.refreshView", () => {
      containerProvider.refresh();
    })
  );
}

export function deactivate() {}
