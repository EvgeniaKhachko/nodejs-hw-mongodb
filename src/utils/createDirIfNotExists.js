import fs from "fs/promises";

// export const createDirIfNotExists = async (path) => {
//     try {
//         await fs.access(path);
//     } catch (err) {
//         console.log(err);

//         if(err.code === 'ENOENT') { 
//     await fs.mkdir(path);
//     }
//  }
// };
export const createDirIfNotExists = async (url) => {
    try {
      await fs.access(url);
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fs.mkdir(url);
      }
    }
  };