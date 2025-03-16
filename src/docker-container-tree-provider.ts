import * as vscode from 'vscode';
import * as cmd from './commands';
import * as parsing from './parsing';
import { DockerContainerTreeItem } from './docker-container-tree-item';

export class DockerContainerProvider implements vscode.TreeDataProvider<DockerContainerTreeItem> {
    private _fileName: string = "docker-compose.yaml";
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
      const activeServices = await cmd.getServices(this.fileName);
      const notStartedServiceNames = parsing.getServiceNames(this.fileName)
        .filter((s) => !activeServices.some((a) => a.serviceName === s));

      const treeItems = activeServices.map((s) => new DockerContainerTreeItem(s.serviceName, s.status))
      .concat(notStartedServiceNames.map((s) => new DockerContainerTreeItem(s, "not-started")));

      vscode.commands.executeCommand('setContext', 'isDockerComposeFileValid', treeItems.length > 0);
      vscode.commands.executeCommand('setContext', 'allContainersRunning', activeServices.length > 0 && notStartedServiceNames.length === 0);
      return treeItems;
    }

    public set fileName (fileName: string) {
        this._fileName = fileName;
        this.refresh();
    }

    public get fileName() {
      return this._fileName;
    }
}