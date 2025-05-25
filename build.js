import { emptyDir, copy, remove } from "fs-extra";
import { join } from "node:path";
import { exec } from "node:child_process";

const root = process.cwd();

(async function () {
  await emptyDir(join(root, "dist"));

  await copy(join(root, "images/logo.png"), join(root, "dist/images/logo.png"));
  await copy(join(root, "scripts"), join(root, "dist/scripts"));
  await copy(join(root, "manifest.json"), join(root, "dist/manifest.json"));
  await copy(join(root, "popup.html"), join(root, "dist/popup.html"));

  await remove(join(root, "redirect-skipper.zip"));

  // only for macOS
  exec("zip -r redirect-skipper.zip dist");
})();
