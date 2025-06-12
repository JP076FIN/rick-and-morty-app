import { Request, Response } from 'express';

interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
}

export async function getAllEpisodes(req: Request, res: Response): Promise<void> {
  const page = parseInt(req.query.page as string) || 1;

  try {
    const response = await fetch(`https://rickandmortyapi.com/api/episode?page=${page}`);
    const data = await response.json();

    const episodes: Episode[] = data.results;

    if (req.headers.accept?.includes('application/json')) {
      res.json({
        episodes,
        hasNextPage: !!data.info.next,
      });
    } else {
      res.render('episodes', {
        episodes,
        title: 'Episode List',
        currentPage: page,
        hasNextPage: !!data.info.next,
      });
    }
  } catch (error) {
    console.error('❌ Failed to fetch episodes:', error);
    res.status(500).render('error', {
      message: 'Failed to fetch episodes.',
      error,
    });
  }
}

export async function getEpisodeDetail(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const response = await fetch(`https://rickandmortyapi.com/api/episode/${id}`);
    const episode = await response.json();

    // Fetch character details
    const characterPromises = episode.characters.map((url: string) =>
      fetch(url).then(res => res.json())
    );
    const characters = await Promise.all(characterPromises);

    res.render('episode', {
      episode,
      characters, // 👈 pass names and ids to EJS
      title: episode.name,
    });
  } catch (error) {
    console.error('❌ Failed to fetch episode:', error);
    res.status(500).render('error', {
      message: 'Failed to fetch episode.',
      error,
    });
  }
}

