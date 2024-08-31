# Customizing site-wide behavior

## Mathlified options

Mathlified can be customized at the top level by passing options to the plugin. Look for the
`vite.config.ts` file and look for the `mathlified()` function in the plugins array.

### Site name

To change the "Mathlified" site name at the top header, you can do this:

```js
mathlified({
  siteName: 'My New Awesome Name'
});
```

### Custom navigation

By default Mathlified regenerates the navigation based on the content it finds in the `src/content`
directory. Look for the `src/lib/nav.ts` file to see the current navigation structure. If you
create/delete/rename a file in the content directory, you will see that this file changes to reflect
the change.

If you will like your own navigation structure, you will have to turn off this auto-regeneration
feature:

```js
mathlified({
  disable: ['autoNav']
});
```

You can then change the `nav.ts` file to your own liking, and Mathlified will no longer overwrite
this file.

> Remember to update this file to reflect new content when you decide to use this feature

## Customization using SvelteKit

With the exception of the `src/lib/nav.ts` file mentioned above and the `directory.ts` file we place
in each content collection route, Mathlified does not overwrite any other file and will add files to
make things work if it is not present.

As such, you can treat this as any other [SvelteKit](https://kit.svelte.dev/) project. Change the
generated files to make it work the way you want, and if you mess things up, you can delete it and
Mathlified will regenerate them again after restarting the dev server. Or you can add your own
features using the power of SvelteKit.

We have had great joy learning about and working with the Svelte and SvelteKit ecosystem and we hope
your experience will be as fruitful.
