import { ExtensionContext, window } from "vscode";
import * as fs from "fs-extra";
import * as path from "path";
import * as archiver from "archiver";
//@ts-ignore
import * as driveLetters from "windows-drive-letters";
import * as os from "os";

export default class ZipperService {
  private _srTemplatePath: string;
  private _tmpPath: string;
  private _zipOutputPath: string;
  private _zipInputPath: string;
  private _zipInputCodePath: string;
  private _zipInputCodeMainPath: string;

  constructor(context: ExtensionContext) {
    this._srTemplatePath = context.asAbsolutePath("sr-template");
    this._tmpPath = context.asAbsolutePath("tmp");
    this._zipOutputPath = context.asAbsolutePath(path.join("tmp", "robot.zip"));
    this._zipInputPath = context.asAbsolutePath(path.join("tmp", "zip"));
    this._zipInputCodePath = context.asAbsolutePath(
      path.join("tmp", "zip", "user")
    );
    this._zipInputCodeMainPath = context.asAbsolutePath(
      path.join("tmp", "zip", "user", "robot.py")
    );

    fs.mkdirp(this._tmpPath);
  }

  get zipPath(): string {
    return this._zipOutputPath;
  }

  public zip(workspacePath: string, mainPath: string): Promise<boolean> {
    const mainPathRelativeToWorkspace = mainPath.substring(
      workspacePath.length + 1
    );
    if (
      mainPathRelativeToWorkspace.includes("\\") ||
      mainPathRelativeToWorkspace.includes("/")
    ) {
      window.showErrorMessage("The file must be in the workspace root.");
      return Promise.resolve(false);
    }

    return new Promise<boolean>(async (resolve, reject) => {
      await fs.emptyDir(this._zipInputPath);
      await fs.copy(this._srTemplatePath, this._zipInputPath);
      await fs.copy(workspacePath, this._zipInputCodePath);

      if (
        fs.existsSync(this._zipInputCodeMainPath) &&
        mainPathRelativeToWorkspace !== "robot.py"
      ) {
        window.showWarningMessage(
          "You have a file called robot.py in your workspace root. This will be overwritten in the output."
        );
        await fs.unlink(this._zipInputCodeMainPath);
      }

      if (mainPathRelativeToWorkspace !== "robot.py") {
        await fs.copy(mainPath, this._zipInputCodeMainPath);
      }

      const zipOutput = fs.createWriteStream(this._zipOutputPath);
      zipOutput.on("close", async () => {
        const isWin = process.platform === "win32";
        let copyPath = "";
        if (isWin) {
          let usedLetters = await driveLetters.usedLetters();
          usedLetters = [];
          copyPath = path.join(
            usedLetters.length >= 2
              ? `${usedLetters[1]}:`
              : path.join(os.homedir(), "Desktop"),
            "robot.zip"
          );
        } else {
          copyPath = path.join(os.homedir(), "robot.zip");
        }
        await fs.copy(this._zipOutputPath, copyPath);
        window.showInformationMessage(`ZIP copied to ${copyPath}`);
        resolve(true);
      });

      const archive = archiver("zip");
      archive.pipe(zipOutput);
      archive.directory(this._zipInputPath, false);
      archive.on("error", err => reject(err));
      archive.finalize();
    });
  }
}
