import {
  Disposable,
  commands,
  window,
  workspace,
  Uri,
  WorkspaceFolder
} from "vscode";
import ZipperService from "./zipper";

export default class CommandsService implements Disposable {
  private _disposable: Disposable;
  private _fileName: string | undefined = undefined;
  private _workspaceFolder: WorkspaceFolder | undefined = undefined;

  constructor(private zipper: ZipperService) {
    this._disposable = Disposable.from(
      commands.registerCommand("sr.zip", this._zip, this)
    );
  }

  private async _zip(): Promise<void> {
    const editor = window.activeTextEditor;

    if (editor) {
      this._fileName = editor.document.fileName;
      this._workspaceFolder = workspace.getWorkspaceFolder(
        Uri.file(this._fileName)
      );

      if (!this._workspaceFolder) {
        window.showErrorMessage("The file must be part of a workspace.");
        return;
      }

      if (this._workspaceFolder.uri.scheme !== "file") {
        window.showErrorMessage("The file must be stored on the local disk.");
        return;
      }
    }

    if (this._fileName && this._workspaceFolder) {
      const workspacePath = this._workspaceFolder.uri.fsPath;

      await this.zipper.zip(workspacePath, this._fileName);
    } else {
      window.showErrorMessage(
        "You must open a python file to run on the robot."
      );
    }
  }

  public dispose(): void {
    this._disposable.dispose();
  }
}
