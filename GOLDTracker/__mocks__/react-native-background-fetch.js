const backgroundFetch = jest.mock('react-native-background-fetch');

backgroundFetch.finish = jest.fn();

export default backgroundFetch;