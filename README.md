# Bunde & Minify

# Getting it to work!

Add a "bundle" tag to your .cshtml page to reference a css or js bundle. In Debug mode it will output the links for each file while in Release mode it will bundle and minify the files.

Add "bundle" tag to your .cshtml page e.g.: 
  For css:     <bundle bundleName="site" bundleType="css"></bundle>
  For js:      <bundle bundleName="site" bundleType="js"></bundle>
    
Add gulpfileBundleConfig.json to the root of your project which will contain all the bundle data, e.g.:

  {
  "DestFolder": "wwwroot/Bundles",
  "BundleAndMinifyInDebug": false, 

  "Bundles": [

    {
      "BundleName": "site",
      "CssSourceFiles": [
        "wwwroot/css/site.css",
        "wwwroot/css/someSampleCss.css",
      ],
      "JsSourceFiles": [
        "wwwroot/js/site.js",
        "wwwroot/css/someSampleJs.css",
      ]
    }

  ]
}

The following needs to be done the first time only:
1. Add file "gulpfile.d.ts" and "gulpfile.ts" to the root of your project
2. Add Pre-build event to store build configuration i.e. Debug or Release : right click project -> Properties -> Build -> Events -> Pre-build event:
     echo {"BuildConfig" : "$(ConfigurationName)"} > ./gulpfileBuildConfig.json
3. Add/edit file "package.json" at the project root and add the following to the "devDependencies" section:
    "gulp": "4.0.2",
    "gulp-concat": "2.6.1",
    "gulp-uglify": "3.0.2",
    "gulp-clean-css": "4.3.0",
    "del": "6.1.1",
    "ts-node": "10.9.1"
4. Add/edit file "tsconfig.json" at the project root and add the following to the "include" section:
     "gulpfile.ts"
7. 
