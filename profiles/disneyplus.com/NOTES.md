# Disney+

Written on 2026-11-22 after the owner reported that nothing plays on the
site in Longboard: it shows its error 83.

Independent work. Not affiliated with, endorsed by or supported by Disney.
The site's name is used only to say which website this file is for.

## What it says

| In the profile | What it is for |
|---|---|
| `match.hosts` | The site, with and without `www`. Nothing else of the company's |
| `view.named` | `false`: on these pages Longboard leaves its own name off the end of what it says it is, and says only what the engine in it says (real engine, real version, real system). Nothing is put in the name's place |

There are no selectors: the site is driven by Longboard's generic mode.

## Why

Longboard ends its identity with `Longboard/<version>`. The maker of
Longboard's engine has an open report, from 2022, that this site answers
with error 83 unless the identity is exactly the engine's own:
https://github.com/castlabs/electron-releases/issues/142

**That this is the cause here is not established.** Nobody has played
anything on the site with this profile yet. Error 83 is the site's general
"this device cannot play" answer and may have another cause, among them
the engine on Linux saying it can play a kind of sound it cannot
(https://github.com/castlabs/electron-releases/issues/221). If the error
stays with this profile on, this file is wrong about the cause and should
be withdrawn.

The profile does nothing about protected playback, a paywall, a region or
a picture-size limit, and could not (Longboard's Hard rules 2 and 3).

## The outline

`outline.txt` is the start of the site's public front page, signed out,
saved by Longboard on 2026-11-22 (structure only). It is here because every
profile needs one; this profile takes no selector from it.

Needs Longboard 0.3.21 or newer. Older versions refuse a profile with a key
they do not know and go on without it.
