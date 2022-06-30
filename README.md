# Getting Started 

!! Must be ensure node's version ≥ 14 

`yarn install` install all packages

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
If you want overwrite the default options of `create-react-app` please use this options of [craco](https://github.com/gsoft-inc/craco)

## Available Scripts

In the project directory, you can run:

### `yarn start` || `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

# Before publish on line, you need to check the list:
1. Compare the `.env` and `.env.production` file, check for errors;

2. Check `index.html`
    * `dns-prefetch` and `preconnect` link 
    * Did the `favicon.ico` has in the `publish` folder

**publish to test environment**
`npm run deploy` or `yarn run deploy`

> After published visit [skeleton.surge.sh](https://skeleton.surge.sh/)

**publish to production**
missing now;

### Router config
- `/src/router/config.tsx` configuration routers;

This project used react-router [v6](https://reactrouter.com/docs/en/v6/getting-started/installation)

### About dev proxy
- set up dev proxy in `craco.config.js`;

use webpack build in configuration see [webpack dev server proxy](https://webpack.js.org/configuration/dev-server/#devserverproxy) 

### About editorconfig
- `/.editorconfig` editorconfig file; 
[more info](https://zhuanlan.zhihu.com/p/349063996)

### About eslint 
- `.eslintrc.json` set up eslint rules;

### About prettier
- `/.prettierrc.json`  configuration options;
- `/.prettierignore`   ignore configuration;

- IDE configuration see [info](https://zhuanlan.zhihu.com/p/81764012) (_section:: 4.IDE 整合_)
- set pre-commit hooks see [info](https://prettier.io/docs/en/precommit.html)
- lint-staged configuration see[configuration](https://github.com/okonet/lint-staged#configuration)

#### web3 with create-react-app(version ≥ 5.0) run errors
_If you are using create-react-app version >=5 you may run into issues building. This is because NodeJS polyfills are not included in the latest version of create-react-app._
[more details](https://github.com/ChainSafe/web3.js#troubleshooting-and-known-issues)

**This project has been resolved this issue in `craco.config.js`**
### Other more

