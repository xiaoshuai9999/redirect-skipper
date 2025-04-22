
import { emptyDir, copy, remove } from 'fs-extra'
import { join } from 'node:path';
import { exec } from 'node:child_process'

const root = process.cwd();

(async function() {
    await emptyDir(join(root, 'dist'));
    await copy(join(root, 'images'), join(root, 'dist/images'));
    await copy(join(root, 'scripts'), join(root, 'dist/scripts'));
    await copy(join(root, 'manifest.json'), join(root, 'dist/manifest.json'));

    await remove(join(root, 'dist.zip'));

    // only for macOS
    exec('zip -r dist.zip dist');

})()