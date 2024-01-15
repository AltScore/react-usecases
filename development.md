# Local development
Target project is a third project we want to use usecases-ui in.

## Configuration in target project

In target project do

```
...
"dependencies": {
    ...
    "usecases-ui": "file:../usecases-ui",
    ...
    }
...
```

and 

```
npm install
```

we also need to make sure react instances are not
being duplicated:

```
npm ls react
```

If it is, then:

```
npm link {usecases-ui-project-path}/node_modules/react
```

## Configuration in usecases-ui project


Then, we need to build to `dist` folder to use it locally
in the target project.

This should update the local package:

```npm run build```


## Caveats

### React link issues
Doing `npm install` in the target project will override the
link to the react instance, so we need to do it again.

### Seeing changes in target project
Every time we change the usecases-ui project, we need to
build it again to see the changes in the target project.