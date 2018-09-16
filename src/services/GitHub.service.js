class DevService {
    getInfo(username) {
        return fetch(`https://api.github.com/users/${username}`)
            .then(resp => {
                if (resp.ok) {
                    return resp.json().then(devInfo => ({
                        username,
                        name: devInfo.name,
                        avatar_url: devInfo.avatar_url,
                        stats: {
                            followers: devInfo.followers,
                            following: devInfo.following,
                            public_repos: devInfo.public_repos,
                            public_gists: devInfo.public_gists
                        }
                    }))
                } else return null;
            })
    }
}

export default new DevService();