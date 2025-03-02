import * as vscode from 'vscode';
import * as cmd from './commands';
import { DockerContainerTreeItem } from './docker-container-tree-item';
import { DockerContainerProvider } from './docker-container-tree-provider';

const fileName = "docker-compose.yaml";
const containerProvider = new DockerContainerProvider();

// Registering the tree view in `activate` function
export function activate(context: vscode.ExtensionContext) {
  vscode.window.registerTreeDataProvider("docker-compose-manager-view", containerProvider);

  // Refresh command
  context.subscriptions.push(
    vscode.commands.registerCommand("docker-compose-manager.stopContainer", 
      async (view: DockerContainerTreeItem) => {
        try {
          await cmd.stopContainer(view.containerName, fileName);
          containerProvider.refresh();
        } catch (err: any) {
          vscode.window.showErrorMessage(err.message);
        }
        
      }),
    vscode.commands.registerCommand("docker-compose-manager.restartContainer", 
      async (view: DockerContainerTreeItem) => {
        try {
          await cmd.restartContainer(view.containerName, fileName);
          containerProvider.refresh();
        } catch (err: any) {
          vscode.window.showErrorMessage(err.message);
        }
      }),
    vscode.commands.registerCommand("docker-compose-manager.rebuildAndRestartContainer", 
      async (view: DockerContainerTreeItem) => {
        try {
          await cmd.rebuildImageAndRestartContainer(view.containerName, fileName);
          containerProvider.refresh();
        } catch (err: any) {
          vscode.window.showErrorMessage(err.message);
        }
    }),
    vscode.commands.registerCommand("docker-compose-manager.rebuildAndRestartContainerWithoutCache", 
      async (view: DockerContainerTreeItem) => {
        try {
          await cmd.rebuildImageAndRestartContainerWithoutCache(view.containerName, fileName);
          containerProvider.refresh();
        } catch (err: any) {
          vscode.window.showErrorMessage(err.message);
        }
    }),
  );
}

export function deactivate() {}
