# Bundle & Minify Css and Javascript

None of the .net 7.0 bundle & minification solutions worked. We needed something simple - when in Debug mode we wanted the raw files to enable easy debugging and in Release mode we wanted the files bundled and minified.

## Just show me how to get it working!

Add a "bundle" tag to your .cshtml page to reference a css or js bundle.

	For css:	<bundle bundleName="site" bundleType="css"></bundle>
	For js:		<bundle bundleName="site" bundleType="js"></bundle>

Add **gulpfileBundleConfig.json** to the root of your project containing the bundle data, e.g.:

    {
      "DestFolder": "wwwroot/Bundles",
      "BundleAndMinifyInDebug": false, 
    
      "Bundles": [
    
        {
          "BundleName": "site",
          "CssSourceFiles": [
            "wwwroot/lib/bootstrap/dist/css/bootstrap.min.css",
            "wwwroot/css/site.css"
          ],
          "JsSourceFiles": [
            "wwwroot/lib/jquery/dist/jquery.min.js",
            "wwwroot/lib/bootstrap/dist/js/bootstrap.bundle.min.js",
            "wwwroot/js/site.js"
          ]
        }
    
      ]
    }

**The painful part follows but only needs to be done once:**
1. Add file **gulpfile.d.ts** and **gulpfile.ts** to the root of your project
2. Add Pre-build event to store build configuration i.e. Debug or Release :
> Right click project -> Properties -> Build -> Events -> Pre-build
> event:
>      echo {"BuildConfig" : "$(ConfigurationName)"} > ./gulpfileBuildConfig.json
4. Add/edit file **package.json** at the project root and add the following to the **devDependencies** section: 
>     "gulp": "4.0.2",
>     "gulp-concat": "2.6.1",
>     "gulp-uglify": "3.0.2",
>     "gulp-clean-css": "4.3.0",
>     "del": "6.1.1",
>     "ts-node": "10.9.1"
5. Add/edit file **tsconfig.json** at the project root and add the following to the "include" section:
> "gulpfile.ts"
6. Add NuGet package **Newtonsoft.Json**
7. Add file **BundleTagHelper.cs** to folder **TagHelpers** at the project root.
8. Consume tag helpers for your project by editing file **/Pages/_ViewImports.cshtml** and adding:
>  @addTagHelper *, <project name>
9. Lastly, and I'm not sure why, we need to open the Task Runner Explorer and  
> Gulpfile.ts -> right click **bundle-and-minify** -> Bindings -> ensure
> **After Build** is selected.
