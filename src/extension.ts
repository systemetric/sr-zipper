"use strict";
import { ExtensionContext } from "vscode";
import StatusIconsService from "./services/status-icons";
import ZipperService from "./services/zipper";
import CommandsService from "./services/commands";

export function activate(context: ExtensionContext): void {
  const statusIconsService: StatusIconsService = new StatusIconsService(
    context
  );
  const zipperService: ZipperService = new ZipperService(context);
  const commandsService: CommandsService = new CommandsService(
    zipperService
  );

  context.subscriptions.push(
    statusIconsService,
    commandsService
  );
}

export function deactivate(): void { }
