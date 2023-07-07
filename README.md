# Bunde & Minify

# How it works

By adding a simple tag to your .cshtml page you can reference a css or js bundle. In Debug mode it will output the links for each file while in Release mode it will bundle and minify the files.

Add a tag to your .cshtml page e.g.: 
  For css:     <bundle bundleName="site" bundleType="css"></bundle>
  For js:      <bundle bundleName="site" bundleType="js"></bundle>
    
Add gulpfileBundleConfig.json to the root of your project containing the bundles, e.g.:

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

When in Debug configuration it WILL NOT bundle and minify your css and js files (this can be overriden for testing).
When in Release configuration it WILL bundle and minify your css and js files.
Css and Js configuration is done 
