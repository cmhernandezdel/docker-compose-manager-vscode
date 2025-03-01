import * as vscode from 'vscode';
import * as cmd from './commands';
import { DockerContainerTreeItem } from './docker-container-tree-item';
import { getServiceNames } from './parsing';


const fileName = "docker-compose.yaml";

// Class to manage Docker containers data
class DockerContainerProvider implements vscode.TreeDataProvider<DockerContainerTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<DockerContainerTreeItem | undefined | void> =
    new vscode.EventEmitter<DockerContainerTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<DockerContainerTreeItem | undefined | void> =
    this._onDidChangeTreeData.event;

  constructor() {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: DockerContainerTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(): Promise<DockerContainerTreeItem[]> {
    const activeServices = await cmd.getServices(fileName);
    const notStartedServiceNames = getServiceNames(fileName)
      .filter((s) => !activeServices.some((a) => a.serviceName === s));

    return activeServices.map((s) => new DockerContainerTreeItem(s.serviceName, s.status))
      .concat(notStartedServiceNames.map((s) => new DockerContainerTreeItem(s, "not-started")));
  }
}


// Registering the tree view in `activate` function
export function activate(context: vscode.ExtensionContext) {
  const containerProvider = new DockerContainerProvider();
  vscode.window.registerTreeDataProvider("docker-compose-manager-view", containerProvider);

  // Refresh command
  context.subscriptions.push(
    vscode.commands.registerCommand("docker-compose-manager.stopContainer", (view: DockerContainerTreeItem) => cmd.stopContainer(view.containerName, fileName)),
    vscode.commands.registerCommand("docker-compose-manager.restartContainer", (view: DockerContainerTreeItem) => cmd.restartContainer(view.containerName, fileName)),
    vscode.commands.registerCommand("docker-compose-manager.rebuildAndRestartContainer", (view: DockerContainerTreeItem) => cmd.rebuildImageAndRestartContainer(view.containerName, fileName)),
    vscode.commands.registerCommand("docker-compose-manager.rebuildAndRestartContainerWithoutCache", (view: DockerContainerTreeItem) => cmd.rebuildImageAndRestartContainerWithoutCache(view.containerName, fileName)),
  );
}

export function deactivate() {}
