# Bunde & Minify

# Getting it to work!

Add a "bundle" tag to your .cshtml page to reference a css or js bundle. In Debug mode it will output the links for each file while in Release mode it will bundle and minify the files.

Add "bundle" tag to your .cshtml page e.g.: 
  For css:     <bundle bundleName="site" bundleType="css"></bundle>
  For js:      <bundle bundleName="site" bundleType="js"></bundle>
    
Add gulpfileBundleConfig.json to the root of your project which will contain all the bundle data, e.g.:

  {
  "DestFolder": "wwwroot/Bundles",
  "BundleAndMinifyInDebug": true, 

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
1. Add file gulpfile.d.ts to the root of your project
2. Add file gulpfile.ts to the root of your project
3. 
