
import { emptyDir, copy } from 'fs-extra'
import { join } from 'node:path';

const root = process.cwd();

(async function() {
    await emptyDir(join(root, 'dist'));
    await copy(join(root, 'images'), join(root, 'dist/images'));
    await copy(join(root, 'scripts'), join(root, 'dist/scripts'));
    await copy(join(root, 'manifest.json'), join(root, 'dist/manifest.json'));
})()