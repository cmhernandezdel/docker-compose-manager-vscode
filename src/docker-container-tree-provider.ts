import * as vscode from 'vscode';
import * as cmd from './commands';
import * as parsing from './parsing';
import { DockerContainerTreeItem } from './docker-container-tree-item';

const fileName = "docker-compose.yaml";

export class DockerContainerProvider implements vscode.TreeDataProvider<DockerContainerTreeItem> {
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
      const notStartedServiceNames = parsing.getServiceNames(fileName)
        .filter((s) => !activeServices.some((a) => a.serviceName === s));
  
      return activeServices.map((s) => new DockerContainerTreeItem(s.serviceName, s.status))
        .concat(notStartedServiceNames.map((s) => new DockerContainerTreeItem(s, "not-started")));
    }
}