#!/usr/bin/env node

/*
 * Spotify Export: Export a listing of your saved tracks as JSON.
 *
 * Copyright © 2020 Maddison Hellstrom (github.com/b0o)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const fetch = require("node-fetch")

const promiseAllAsync = async (iter, reduce = (chunks) => chunks) => {
  const res = []
  for await (const e of iter) {
    res.push(e)
  }
  return reduce(res)
}

const getTracksPage = async (authToken, offset, limit) => {
  const res = await fetch(`https://api.spotify.com/v1/me/tracks?offset=${offset}&limit=${limit}&market=from_token`, {
    credentials: "include",
    headers:     {
      "User-Agent":          "Mozilla/5.0 (X11; Linux x86_64; rv:77.0) Gecko/20100101 Firefox/77.0",
      Accept:                "application/json",
      "Accept-Language":     "en",
      "app-platform":        "WebPlayer",
      "spotify-app-version": "1590597682",
      authorization:         authToken,
    },
    method: "GET",
  })
  if (!res.ok) {
    throw new Error(`fetch failed: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

const getTracks = (authToken, limit = 0, step = 50) => ({
  async* [Symbol.asyncIterator]() {
    for (let offset = 0, next = 0; limit < 1 || offset <= limit;) {
      next = limit < 1 ? step : Math.min(step, limit - offset)
      if (next <= 0) break

      // eslint-disable-next-line no-await-in-loop
      const res = await getTracksPage(authToken, offset, next)
      yield res.items

      offset += next
      if (res.next === null) break
    }
  },
})

const main = async () => {
  if (process.argv.length !== 3) {
    process.stderr.write(`usage: ${process.argv[1]} <auth token>\n`)
    process.exit(1)
  }
  const authToken = process.argv[2]
  const tracks = await promiseAllAsync(getTracks(authToken), (chunks) => [].concat(...chunks))
  process.stdout.write(`${JSON.stringify(tracks, null, 2)}\n`)
}

main()
  .then(() => {})
  .catch((e) => process.stderr.write(`${e.message}\n`))
