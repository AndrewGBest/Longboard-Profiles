# YouTube on TV

Written on 2026-11-21 at the owner's request: the site has an app made for
TVs at its `/tv` address, and gives it only to devices that say they are a
TV. Longboard is a TV browser, so for those pages it says so.

Independent work. Not affiliated with, endorsed by or supported by Google or
YouTube. The site's name is used only to say which website this file is for.

## What it says

| In the profile | What it is for |
|---|---|
| `match.hosts`, `match.paths` | The site's `/tv` address and nothing else. These are the pages the TV statement and the remote hand-over apply to. Other sites of the same company (its music site, its sign-in pages) are other hosts and are not touched |
| `view.entry` | `/tv`: every address of the site is opened at the TV app instead of the ordinary site. Found necessary on the live site: told it is a TV, the ordinary addresses still serve the ordinary site |
| `view.carry` | `["v"]`: a link to one video keeps its video. Tried on the live site: the TV app opened at `/tv?v=<id>` plays it. No other parameter was tried, so no other is listed |
| `view.device` | `"tv"`: for these pages Longboard adds to its usual identity that it is Longboard running as a TV, and leaves the remote to the site's app (arrows, OK, media keys, and Back as Escape or Backspace) |

The words Longboard uses are Longboard's (its Hard rule 3): its
real engine, version and system, then `Longboard_TV_<chip>_<year>/<version>
(Longboard, <system>)` (from Longboard 0.3.24; before that without the chip
and the year, and the site then held back video previews). It does not claim to be another browser, another maker's TV or a
console, and the profile could not make it.

## How to use it

Go to the site, by any address: it opens in the TV app. A link to one video
opens that video there. To have the ordinary site, switch the profile off
for it: the menu, "This page", "Use this site's profile".

Needs Longboard 0.3.15 or newer. Older versions refuse a profile with a key
they do not know and carry on without it.

## Evidence

`outline.txt`: the first lines of the TV app's first screen, signed out,
2026-11-21. The profile has no selectors to prove; the outline shows the page
served is the TV app.

## What was tested

By script, 2026-11-21, with Longboard 0.3.13's code:

- The TV app is served and starts, where without the profile the address
  gives a "not for this device" page.
- The page's scripts and its requests are told the same identity; the
  ordinary site in the same run is told the usual one.
- The arrows reach the app untouched and Longboard draws no highlight.
- The plain address, with and without `www`, lands on the TV app; a search
  address opens the ordinary search page with the usual identity (0.3.14's code).

- As a guest (the account screen's "Watch as guest", in a new data folder):
  a short link to a video lands on the TV app and that video plays; Back
  leaves the player for the app's start page; the arrows move among the
  videos there. A search address lands on the app's start (1.2.0, with
  Longboard 0.3.15's code).

**Not tested:** signing in (the app does it with a code on another device,
and a scripted run of Longboard never presses sign-up controls), the app's
search and its own keyboard, Back at the app's top level, and anything by a
person with a remote.

## Risk

The site's terms may reserve this interface for its own apps and certified
devices, and it may stop serving it to Longboard at any time. If it does,
the profile does nothing and the ordinary site is still there.
