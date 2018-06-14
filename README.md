# eslint-plugin-tsc
Wraps a TypeScript compiler checks

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
2. Add rule to `rules` section, e.g.
```
"tsc/config": [1, {
    configFile: "tsconfig.json"
}]
```

## RULES
* `tsc/config` Wraps a TypeScript compiler checks  
  Configuration `{ configFile: string, compilerOptions?: ts.CompilerOptions }`  
  `configFile` path to `tsconfig.json` file  (it's better to specify an absolute path)  
  `compilerOptions` ability to override compilerOptions defined in config file

## CHANGELOG
See [CHANGELOG.md](CHANGELOG.md)

## TODO
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

## USEFUL LINKS
* https://astexplorer.net/
