This project assumes you have installed and configured [mise].  If you have, it should automatically warn you if you do not have the
required versions of [node], [pnpm], [just], and other build tools the project depends on.  Any exceptions will be noted here.

Assuming that you *do* have mise, and it has *not* complained, you can simply run

```
just dev
```

to get a local development version of the project.

If you need to get a production version, run
```
just parse
```
then pick the right frontend from the packages directory, cd into that and run
```
pnpm build
```
there

The deploy is currently still under development.

## Exceptions:

* This project assumes that you have the GNU version of sed, in your path, as 'gsed'.  This is typical on Mac OSX systems, and probably nowhere else, but trivial to achieve with aliases on any unix where this is not true.
* mise cannnot install [jq] for you.
* mise cannot install [yq] for you

[jq]: https://jqlang.org/
[yq]: https://mikefarah.gitbook.io/yq
[mise]: https://mise.jdx.dev/
[node]: https://nodejs.org/
[pnpm]: https://pnpm.io/
[just]: https://just.systems/
