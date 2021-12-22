module.exports = {
  client: {
    service: {
      name: 'github',
  url: `${process.env.REACT_APP_GITHUB_API_URL}/graphql`,
      // optional headers
  headers: {
    authorization: `Bearer ${process.env.REACT_APP_GITHUB_PERSONAL_AUTH_TOKEN}`,
  },
    }
  }
};
