import axios from 'axios';

// Define the base URL for your API server
const API_BASE_URL = 'https://api.example.com';

// Create an instance of Axios with the base URL
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Define a function to fetch data from the API
const fetchData = async () => {
    try {
        // Make a GET request to the '/data' endpoint
        const response = await api.get('/data');

        // Access the data from the response
        const data = response.data;

        // Do something with the data
        console.log(data);
    } catch (error) {
        // Handle any errors that occur during the request
        console.error(error);
    }
};

export default fetchData;