import { RickAndMortyResponse } from './interfaces.js';

/**
 * Function to get data from a server
 * @param {string} url The URL to fetch data from.
 * @returns {Promise<RickAndMortyResponse>} A promise that resolves to the API response
 * containing the data or an error.
 */
export const getData = async (url: string): Promise<RickAndMortyResponse> => {
  try {
    const res: Response = await fetch(url);
    const items: RickAndMortyResponse = await res.json();
    return items;
  } catch (error) {
    return {
      error,
    };
  }
};

/**
 * Function to get all data from different urls
 * @param {string} appUrlsData An array of URL paths to fetch data from.
 * @returns {Promise<RickAndMortyResponse[]>} A promise that resolves to an array of
 * RickAndMortyResponse objects from the provided URLs.
 */
export const getAllDataFromDifferentUrls = async (
  appUrlsData: string[]
): Promise<RickAndMortyResponse[]> => {
  // setup the promises
  const promises: Promise<RickAndMortyResponse>[] = appUrlsData.map((url: string) =>
    getData(`https://rickandmortyapi.com/api${url}`)
  );
  // fetch all appointments
  try {
    const items: RickAndMortyResponse[] = await Promise.all(promises);
    return items;
  } catch (error: unknown) {
    console.log('❌ API error:', error);
    return [{ error }];
  }
};

/**
 * Function to get data from a server
 * @param {string} url The URL to fetch data from.
 * @returns {Promise<RickAndMortyResponse>} A promise that resolves to the API response
 * containing the data or an error.
 */
export const getDataFromAuthenticatedApi = async (url: string): Promise<RickAndMortyResponse> => {
  try {
    const res: Response = await fetch(url, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      }
    });
    const items: RickAndMortyResponse = await res.json();
    return items;
  } catch (error) {
    return {
      error,
    };
  }
};
