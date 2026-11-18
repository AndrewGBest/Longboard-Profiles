# Prime Video

Converted on 2026-11-18 from the site adapter of Tropic Video (revision 3),
Longboard's predecessor. It is the first profile and was the test of the
format: everything the adapter said has a place in it, after the format gained
`focus.scrollPrevious` / `focus.scrollNext`, `text.searchOpen`, `player.close`
and `guard.purchase`.

Independent work. Not affiliated with, endorsed by or supported by Amazon.
The site's name is used only to say which website this file is for.

## What it says

| In the profile | What it is for |
|---|---|
| `match.hosts` | The website. Its sign-in pages live on other domains and are driven in generic mode |
| `view.canvas` | 960x540: at this size the site still shows its full navigation bar and four cards to a row |
| `focus.scrollPrevious`, `focus.scrollNext` | The arrows of the top carousel and of each row of cards. Pressed when left or right runs out; never highlighted |
| `player.container` | What the site's player lives in, so the background trailer on a title's page is not taken for the player |
| `player.keys` | The site's player answers to Space and the left and right arrows |
| `text.search`, `text.searchOpen` | The search field, and the button that reveals it |
| `guard.purchase` | The sign-up link and the Store's checkout button, which an automated run never presses whatever they say |

## Evidence

`outline.txt` holds the trimmed page outlines that show each selector. The
same files are in the Longboard repository, where a test rebuilds those pages
from the outline and checks every selector against them
(`test/profile-evidence.test.ts`).

## What was tested

- With Tropic Video, by its owner on the live site, signed in, on a Linux TV
  box with a remote: see that project's status notes.
- With Longboard: only that the profile is valid, that it is chosen for the
  site's addresses, and that its selectors match the outline. **It has not
  been run against the live site in Longboard.**
