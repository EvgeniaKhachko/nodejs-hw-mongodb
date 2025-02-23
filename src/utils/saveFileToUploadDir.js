

import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/path.js';
import { getEnvVar } from './getEnvVar.js';

export const saveFileToUploadDir = async (file) => {
  path.join(TEMP_UPLOAD_DIR, file.filename)

  return `${getEnvVar('APP_DOMAIN')}/uploads/${file.filename}`;
};
