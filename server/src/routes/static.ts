import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import express from 'express';

// set dirname as per https://stackoverflow.com/a/62892482/2935062
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const STATIC_PATH = path.join(__dirname, '../client');

export const staticMiddleware = express.static(STATIC_PATH);
