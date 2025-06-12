import { Request, Response } from 'express';
import { RickAndMortyResponse } from '../utils/interfaces.js';
import * as Dotenv from 'dotenv';
import { getAllDataFromDifferentUrls } from '../utils/ajax.js';

Dotenv.config({ path: '.env' });

export const getIndex = async (req: Request, res: Response): Promise<void> => {
  // IDs 1–5
  const fixedIds = [1, 2, 3, 4, 5];
  const maxId = 826;

  // Generate one random ID that's not in fixedIds
  let randomId: number;
  do {
    randomId = Math.floor(Math.random() * maxId) + 1;
  } while (fixedIds.includes(randomId));

  // Combine fixed + random
  const allIds = [...fixedIds, randomId];

  // Build URL paths for each ID
  const urls = allIds.map(id => `/character/${id}`);

  // Fetch data from API
  const characters: RickAndMortyResponse[] = await getAllDataFromDifferentUrls(urls);

  // Render all characters
  res.render('index', { characters });
};
