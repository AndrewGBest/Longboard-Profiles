# Spotify web player

Written on 2026-11-20 after a test run of Longboard over 49 sites with a
person's accounts signed in. It is the one site of those where a profile did
something the general rules could not: the site is an app of panes laid out
taller than the 960x540 page Longboard usually draws, with the page's own
scrolling shut off, so its player bar sat below the bottom of the screen.

Independent work. Not affiliated with, endorsed by or supported by Spotify.
The site's name is used only to say which website this file is for.

## What it says

| In the profile | What it is for |
|---|---|
| `match.hosts` | The web player, and only it. Sign-in happens on another domain, in generic mode |
| `view.canvas` | 1280x720. At 960x540 the app is 601 high in a window of 540 and cannot be scrolled; at 1280x720 it fits whole (measured: 724 high in 724). Text is smaller for it |
| `focus.initial` | The first thing in the main pane, so the first press lands on what there is to play and not on a link in the bar across the top |
| `focus.groups` | The four parts of the app: the main pane and the library column (up and down stay in them while they have more that way), the bar across the top and the player bar (left and right stay in them) |
| `text.search` | The search field, for the search key |

There is no `player` or `guard` section: nothing about them has been captured
in an outline, so nothing is said (no guesses). The panel on the right that
shows what is playing exists only when signed in; outlines from a signed-in
session are not committed, so the profile says nothing about it and Longboard
works it out by itself.

## Evidence

`outline.txt`: the start page, signed out, captured on 2026-11-20 and trimmed.

## What was tested

By script only, with Longboard 0.3.12's code at a 1920x1080 window, on
2026-11-20:

- Signed out, in a new data folder: the app fits; the first press lands in
  the main pane; the library column, the top bar and its search field are
  reached with the arrows.
- Signed in (a person's own account, signed in by them): the same, and the
  panel on the right is reached with Right from the main pane.

**Not tested:** by a person with a remote; playing anything; the search
results page; any other page of the app. The notice about cookies: from profile
1.1.0 its close button is named as `dismiss` (shown in the outline, added
2026-11-23), so Back closes it, and from Longboard 0.3.26 the highlight
starts on it while it is showing. Tried signed out on 2026-11-23: the
first press landed on the X, OK closed it, and so did Back.
