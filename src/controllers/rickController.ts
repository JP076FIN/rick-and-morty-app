import { Request, Response } from 'express';

interface RickCharacter {
  id: number;
  name: string;
}

interface RickAndMortyAPIResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: RickCharacter[];
}

export async function getRickCharacters(req: Request, res: Response): Promise<void> {
  console.log('✅ /locations route was hit');

  const fixedIds = [1, 2, 3, 4, 5];
  const maxCharacters = 826;

  let randomId: number;
  do {
    randomId = Math.floor(Math.random() * maxCharacters) + 1;
  } while (fixedIds.includes(randomId));

  const allIds = [...fixedIds, randomId];

  try {
    const characters = await Promise.all(
      allIds.map(id =>
        fetch(`https://rickandmortyapi.com/api/character/${id}`).then(res => res.json())
      )
    );

    res.render('index', {
      characters,
      title: 'Character Overview',
      layout: 'layouts/layout' // optional if globally configured
    });
  } catch (error) {
    console.error('❌ Failed to load characters:', error);
    res.status(500).render('error', {
      message: 'Failed to load characters.',
      error
    });
  }
}

export async function getAllRickCharacters(req: Request, res: Response): Promise<void> {
  const page = req.query.page || 1;

  try {
    const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
    const data: RickAndMortyAPIResponse = await response.json();

    const characters: RickCharacter[] = data.results.map((char: RickCharacter) => ({
      id: char.id,
      name: char.name,
    }));

    // If it's an AJAX request, send JSON
    if (req.headers.accept?.includes('application/json')) {
      res.json({
        characters,
        hasNextPage: !!data.info.next,
      });
    } else {
      // Otherwise render EJS
      res.render('characters', {
        characters,
        title: 'Character List',
        currentPage: page,
        hasNextPage: !!data.info.next,
      });
    }
  } catch (error) {
    console.error('❌ Failed to fetch all characters:', error);
    res.status(500).render('error', {
      message: 'Failed to fetch characters.',
      error,
    });
  }
}

export async function getCharacterDetail(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
    const character = await response.json();

    // Extract IDs
    const locationId = character.location?.url?.split('/').pop();
    const originId = character.origin?.url?.split('/').pop();

    // Extract episode IDs
    const episodeIds = character.episode.map((url: string) => url.split('/').pop()).join(',');

    // Fetch all episodes the character appeared in
    const episodeRes = await fetch(`https://rickandmortyapi.com/api/episode/${episodeIds}`);
    const episodes = await episodeRes.json();
    const episodeList = Array.isArray(episodes) ? episodes : [episodes];

    // Render character view with everything
    res.render('character', {
      character,
      locationId,
      originId, // ✅ Include originId again
      episodes: episodeList,
      title: character.name,
    });
  } catch (error) {
    console.error('❌ Failed to load character detail:', error);
    res.status(500).render('error', {
      message: 'Failed to load character.',
      error,
    });
  }
}
