import { emptyDir, copy, remove } from "fs-extra";
import { join } from "node:path";
import { exec } from "node:child_process";

const root = process.cwd();

(async function () {
  await emptyDir(join(root, "dist"));

  await copy(
    join(root, "images/logo-16.png"),
    join(root, "dist/images/logo-16.png")
  );
  await copy(
    join(root, "images/logo-32.png"),
    join(root, "dist/images/logo-32.png")
  );
  await copy(
    join(root, "images/logo-64.png"),
    join(root, "dist/images/logo-64.png")
  );
  await copy(
    join(root, "images/logo-128.png"),
    join(root, "dist/images/logo-128.png")
  );

  await copy(join(root, "src"), join(root, "dist/src"));

  await copy(join(root, "manifest.json"), join(root, "dist/manifest.json"));
  await copy(join(root, "page-popup.html"), join(root, "dist/page-popup.html"));
  await copy(
    join(root, "page-options.html"),
    join(root, "dist/page-options.html")
  );

  await remove(join(root, "redirect-skipper.zip"));

  // only for macOS
  exec("zip -r redirect-skipper.zip dist");
})();
