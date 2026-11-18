# Longboard Profiles

Shared website profiles for [Longboard](https://github.com/AndrewGBest/Longboard),
the web browser for TVs, plus the list of verified sites.

**Status: skeleton.** There are no profiles here yet, and Longboard itself is
at the design stage. The format may still change.

## What is here

| Path | What |
|---|---|
| `profiles/<domain>/` | One folder per website: `profile.json`, `outline.json` (the evidence), `NOTES.md` (what was tested) |
| `verified-sites.json` | Websites a person has reviewed and found to carry non-malicious advertising. Longboard starts with ad blocking off on these; the person can still switch it on |
| `template/profile.json` | Copy this to start a profile |
| `scripts/` | The checks that run on every pull request, and the index builder |

A profile is data, not a program. It says where things are on one website so
Longboard's highlight moves sensibly. It cannot run code. The format is
described in
[PROFILES.md](https://github.com/AndrewGBest/Longboard/blob/main/docs/PROFILES.md).

## Adding or fixing something

See [CONTRIBUTING.md](CONTRIBUTING.md). In short: one folder per site, open a
pull request, the checks must pass, a maintainer reviews it.

Run the checks yourself with Node 22 or newer:

```
npm run check
```

## Licence

Everything here is released under CC0-1.0: free for anyone to reuse, for any
purpose, with no conditions.

This project is independent. It is not affiliated with any website listed
here. Site names are used only to say which website a file is for.
