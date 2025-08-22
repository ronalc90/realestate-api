const API_BASE_URL = 'https://realestate-api-k012.onrender.com/api';

export const getProperties = async (page = 1, pageSize = 20) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Properties?page=${page}&pageSize=${pageSize}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const getPropertyById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Properties/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
};
