# eslint-plugin-tsc
TypeScript Compiler has various [linting options](http://www.typescriptlang.org/docs/handbook/compiler-options.html)
* allowUnreachableCode
* allowUnusedLabels
* forceConsistentCasingInFileNames
* noFallthroughCasesInSwitch
* noImplicitAny
* noImplicitReturns
* noImplicitThis
* noStrictGenericChecks
* noUnusedLocals
* noUnusedParameters
* strictFunctionTypes
* strictPropertyInitialization
* strictNullChecks
* suppressExcessPropertyErrors
* suppressImplicitAnyIndexErrors


## INSTALL
```
npm install --save-dev eslint-plugin-tsc
```

## USAGE
Configure it in [your configuration file](https://eslint.org/docs/user-guide/configuring):  
1. Add to `plugins` section:
```
tsc
```
2. Add to `extends` section (optional):
```
plugin:tsc/recommended
```
3. [Configure rules](https://eslint.org/docs/user-guide/configuring#configuring-rules)

## RULES

## USEFUL LINKS
* https://astexplorer.net/

## CHANGELOG
See [CHANGELOG.md](CHANGELOG.md)
