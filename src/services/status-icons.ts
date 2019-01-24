import {
  StatusBarItem,
  window,
  StatusBarAlignment,
  Disposable,
  ExtensionContext
} from "vscode";

export default class StatusIconsService implements Disposable {
  private _zipStatusIcon: StatusBarItem;
  private _disposable: Disposable;

  constructor(context: ExtensionContext) {
    this._zipStatusIcon = window.createStatusBarItem(StatusBarAlignment.Left);
    this._zipStatusIcon.text = "$(package) Make SR ZIP";
    this._zipStatusIcon.command = "sr.zip";
    this._zipStatusIcon.show();

    this._disposable = Disposable.from(
      this._zipStatusIcon,
    );
  }

  dispose(): void {
    this._disposable.dispose();
  }
}
