# Xbox Cloud Gaming

Written on 2026-11-23. The site gives browsers on TVs a different layout of
its ordinary pages, and gives it only to browsers that say they are on one.
Longboard is a TV browser, so for this site it says so.

Independent work. Not affiliated with, endorsed by or supported by Microsoft
or Xbox. The site's name is used only to say which website this file is for.

## What it says

| In the profile | What it is for |
|---|---|
| `match.hosts` | `play.xbox.com` and nothing else. The company's other sites, and its sign-in pages, are other hosts and are not touched |
| `view.device` | `"tv-browser"`: for these pages Longboard adds the plain words for a television with a browser to the end of its usual identity. Everything else it says stays as it is, and Longboard goes on moving the highlight itself |

The words Longboard uses are set in Longboard, not here (its Hard rule 3).
The profile names no elements.

## What was measured

On 2026-11-23, signed in, on Linux x86-64, 1920x1080, with a keyboard's
arrow keys sent by script (Longboard under `--automation`):

| | Without the profile | With it |
|---|---|---|
| Layout | Side bar of small icons (controls about 53 by 56 on screen), search field in a top bar | No side bar; controls about 163 by 64; one top bar |
| Elements on the first page | about 1,320 | about 660 |
| Arrow keys | Down goes into the side bar and Right does not leave it: the rows of games could not be reached | Every row reached: down through the rows, left and right along them, up to the top bar |
| OK on a game | Not reached | Opens the site's "what you'll need to play" panel; Back closes it |
| Up twice at the top | - | Longboard's menu opens |

Seven endings were tried to find what the site looks for; only the term
Longboard now uses (with or without its hyphen, in any case) changed the
layout. The identity Longboard uses for the first kind of TV interface
(`"tv"`) did not.

## Not tested

- **Playing a game.** No stream was started: there was no controller on the
  test machine, and the site asks for one. Whether a stream starts and how
  it looks in this layout is unknown until somebody tries it on a TV.
- A controller's own buttons on the site's pages (the site shows controller
  hints in this layout). Longboard's controller mapping sends the same
  arrows and OK as the keys tested.
- Signed out, the site showed the same change of layout on 2026-11-23, but
  nothing was driven there.
- Needs Longboard 0.3.28 or newer. Older versions do not know the word
  `"tv-browser"`, refuse the profile and show the site as before.
