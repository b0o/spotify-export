Spotify Export
==============

Export a listing of your saved tracks as JSON.

Usage
-----

1. Install this tool locally
- 1. `git clone https://github.com/b0o/spotify-export`
- 2. `cd spotify-export`
- 3. `npm install`

2. Navigate to the [Spotify Web Player](https://open.spotify.com/) and sign in

3. Obtain your auth token
- 1. Open your browser's devtools
- 2. Select the Network tab
- 3. Refresh the page
- 4. Find any request to the domain `api.spotify.com`
- 5. Select the request, then under *Request Headers* find the `authorization: Bearer ...` header
- 6. Right click and copy the header

4. Run `index.js`, passing your auth token, and redirect stdout to a file:

```
$ ./index.js "authorization: Bearer <token>" > spotify-saved-songs.json
```

License
-------
&copy; 2020 Maddison Hellstrom

Released under the GPL-3.0 License
