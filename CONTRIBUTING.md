# Contributing

## A profile

1. In Longboard, open the site and choose "Save page outline" in the menu.
   The file is written to the `diagnostics` folder of Longboard's data
   folder (`~/.config/Longboard` on Linux).
2. Create `profiles/<main-domain>/` (for example `profiles/example.com/`).
3. Copy `template/profile.json` into it as `profile.json` and fill it in from
   what the outline shows. Delete the keys you do not use.
4. Add the outline as `outline.txt`. Trim it to the parts that show your
   selectors if it is long; several pages can go in one file, each begun by
   a line starting with `####`. Lines starting with `#` are notes.
5. Add `NOTES.md`: what you tested, on what device and input, and the date.
6. Run `npm run index` and `npm run check`, then open a pull request.

What reviewers look for:

- every selector appears in the outline. No guesses;
- the outline holds structure only: no text, names, links or account details;
- the site still works in Longboard's generic mode without the profile;
- nothing is copied from the site: no artwork, text or code;
- one profile per site. To improve an existing one, edit it and raise its
  version.

The automatic check validates the profile's shape, refuses unknown keys and
scripts, and refuses an outline that has a line with a space or an address in
it (an outline line is one element written as one token, so either means
text got in). Comparing each selector against the outline is still done by
the reviewer.

## A verified site

`verified-sites.json` lists websites whose advertising a person has reviewed
and found not to be malicious. On these, Longboard starts with ad blocking
off. To propose one, add an entry in alphabetical order with your GitHub name
and the date, and say in the pull request what you looked at.

A site belongs on the list when its ads come from the site's own, ordinary
advertising, and not from pop-ups, fake download buttons, redirects or
anything that tries to install or scam. If in doubt, leave it off: sites not
on the list simply start with blocking on.

## Rules

- Data only. A profile with a `scripts` key or any unknown key is rejected.
- No trademarks as artwork. Plain-text site names are fine.
- By contributing you release your work under CC0-1.0.
- AI assistance is fine. Say that you used it and check what you submit.
