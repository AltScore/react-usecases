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