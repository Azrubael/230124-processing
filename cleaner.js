import { join } from 'node:path'
import { readdir, stat, unlink } from 'node:fs/promises'

// Recursive search in directories
const deepReadDir = async (dir) => await Promise.all(
   (await readdir(dir, { withFileTypes: true })).map(async (dirent) => {
      const path = join(dir, dirent.name)
      return dirent.isDirectory() ? await deepReadDir(path) : path
   })
)

// Getting detailed file statistics in selected directory
const statDir = async (dir) => await Promise.all(
   (await readdir(dir, { withFileTypes: true })).map(async (dirent) => {
      const path = join(dir, dirent.name)
      const inf = await stat(path)
      console.log(inf)
      return
   })
)

// Deleting old files in selected directory
const cleanDir = async (dir, lastChangeTimeInHours = 24) => await Promise.all(
   (await readdir(dir, { withFileTypes: true })).map(async (dirent) => {
      const path = join(dir, dirent.name)
      const inf = await stat(path)
      if ( inf.mtimeMs > lastChangeTimeInHours*60*60*1000 ) {
         unlink(path)
         console.log('deleted file: ', path)
      } else {
         console.log('Kept file: ', path)
      }
      return
   })
)

let r = await deepReadDir('uploads')
// But you can easily flat it, if you want to handle recursive directories:
// (await deepReadDir('src')).flat(Number.POSITIVE_INFINITY)
console.log(r)


export { deepReadDir, cleanDir, statDir }
