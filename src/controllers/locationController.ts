import { Request, Response } from 'express';

interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
}

export async function getAllLocations(req: Request, res: Response): Promise<void> {
  console.log('✅ /locations route was hit');

  const page = req.query.page || 1;

  try {
    const response = await fetch(`https://rickandmortyapi.com/api/location?page=${page}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('Invalid data from API');
    }

    const locations: Location[] = data.results;

    if (req.headers.accept?.includes('application/json')) {
      res.json({
        locations,
        hasNextPage: !!data.info?.next,
      });
    } else {
      res.render('locations', {
        locations,
        title: 'Location List',
        currentPage: page,
        hasNextPage: !!data.info?.next,
      });
    }
  } catch (error) {
    console.error('❌ Failed to fetch locations:', error);
    res.status(500).render('error', {
      message: 'Failed to fetch locations.',
      error,
    });
  }
}



export async function getLocationDetail(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const response = await fetch(`https://rickandmortyapi.com/api/location/${id}`);
    const location = await response.json();

    // ✅ Add this logic to fetch resident characters
    const residentPromises = location.residents.map((url: string) =>
      fetch(url).then(res => res.json())
    );
    const residents = await Promise.all(residentPromises);

    // ✅ Make sure you include 'residents' in the render data
    res.render('location', {
      location,
      residents, // <--- this line must be present
      title: location.name,
    });
  } catch (error) {
    console.error('❌ Failed to load location:', error);
    res.status(500).render('error', {
      message: 'Failed to load location.',
      error,
    });
  }
}
