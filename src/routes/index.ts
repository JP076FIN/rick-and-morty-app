import { Router } from 'express';
import { getRickCharacters, getAllRickCharacters, getCharacterDetail } from '../controllers/rickController.js';
import { getAllLocations, getLocationDetail } from '../controllers/locationController.js';
import { getAllEpisodes, getEpisodeDetail } from '../controllers/episodeController.js';




const router: Router = Router();

router.get('/', getRickCharacters); // home overview
router.get('/characters', getAllRickCharacters); // full list
router.get('/character/:id', getCharacterDetail); // Specific character info
router.get('/locations', getAllLocations);
router.get('/location/:id', getLocationDetail);
router.get('/episodes', getAllEpisodes);
router.get('/episode/:id', getEpisodeDetail);


export default router;
