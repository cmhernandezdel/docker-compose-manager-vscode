import * as vscode from 'vscode';

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'running':
            return '🟢';
        case 'paused':
            return '🟡';
        default:
            return '🔴';      
    }
};

// View rendered in the left side pane that represents a Docker container
export class DockerContainerTreeItem extends vscode.TreeItem {
    public containerName: string;

    constructor(containerName: string, status: string) {
        
        const icon = getStatusIcon(status);
        const label = `${icon} ${containerName}`;
        super(label, vscode.TreeItemCollapsibleState.None);

        this.containerName = containerName;
    }
}