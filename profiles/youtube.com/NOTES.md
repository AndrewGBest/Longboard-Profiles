# YouTube on TV

Written on 2026-11-21 at the owner's request: the site has an app made for
TVs at its `/tv` address, and gives it only to devices that say they are a
TV. Longboard is a TV browser, so for those pages it says so.

Independent work. Not affiliated with, endorsed by or supported by Google or
YouTube. The site's name is used only to say which website this file is for.

## What it says

| In the profile | What it is for |
|---|---|
| `match.hosts`, `match.paths` | The site's `/tv` address and nothing else. The ordinary site at the same domain is not touched and is told only Longboard's usual identity |
| `view.device` | `"tv"`: for these pages Longboard adds to its usual identity that it is Longboard running as a TV, and leaves the remote to the site's app (arrows, OK, media keys, and Back as Escape or Backspace) |

That is all. The words Longboard uses are Longboard's (its Hard rule 3): its
real engine, version and system, then `Longboard_TV/<version> (Longboard,
<system>)`. It does not claim to be another browser, another maker's TV or a
console, and the profile could not make it.

## How to use it

Open `youtube.com/tv` (add it to Home). Opening `youtube.com` gives the
ordinary site as before; a profile cannot send you from one to the other.

Needs Longboard 0.3.13 or newer. Older versions refuse a profile with a key
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

**Not tested, and why:** anything past the app's first screen. Its only
button there starts signing in, and a scripted run of Longboard never presses
sign-up controls. So browsing, search, the player, Back at the top level and
signing in (which the app does with a code on another device) have not been
seen. They need a person with a remote.

## Risk

The site's terms may reserve this interface for its own apps and certified
devices, and it may stop serving it to Longboard at any time. If it does,
the profile does nothing and the ordinary site is still there.
