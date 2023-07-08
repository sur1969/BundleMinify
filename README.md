

# Bundle & Minify Css and Javascript

None of the .net 7.0 bundle & minification solutions worked. We needed something simple so that when we're in Debug mode, the individual files are output to enable debugging but in Release mode the files are bundled and minified.

## How to get it working!

Add a **bundle** tag to your .cshtml page to reference a css or javascript bundle.

	For css:	<bundle name="site" type="css"></bundle>
	For js:		<bundle name="site" type="js"></bundle>
When bundled this will output:

    <link rel="stylesheet" href="Bundles/site.min.css?v=...">
    <script src="Bundles/site.min.js?v=..."></script>

Add [gulpfileBundleConfig.json](https://github.com/sur1969/BundeMinify/blob/master/BundeMinify/gulpfileBundleConfig.json) to the root of your project containing the bundle data, e.g.:

    {
      "DestFolder": "wwwroot/Bundles",
      "BundleAndMinifyInDebug": false, 
    
      "Bundles": [
    
        {
          "Name": "site",
          "CssFiles": [
            "wwwroot/lib/bootstrap/dist/css/bootstrap.min.css",
            "wwwroot/css/site.css"
          ],
          "JsFiles": [
            "wwwroot/lib/jquery/dist/jquery.min.js",
            "wwwroot/lib/bootstrap/dist/js/bootstrap.bundle.min.js",
            "wwwroot/js/site.js"
          ]
        }
    
      ]
    }
 
*Note, wildcards in file paths are not currently supported.*

**The painful part follows but only needs to be done once:**
1. Add files [gulpfile.d.ts](https://github.com/sur1969/BundeMinify/blob/master/BundeMinify/gulpfile.d.ts)  and [gulpfile.ts](https://github.com/sur1969/BundeMinify/blob/master/BundeMinify/gulpfile.ts) to the root of your project
2. Add Pre-build event to store build configuration i.e. Debug or Release :

> Right click project -> Properties -> Build -> Events -> Pre-build
> event -> enter the following command:
> 
>      echo {"BuildConfig" : "$(ConfigurationName)"} > ./gulpfileBuildConfig.json
3. Add/edit file **package.json** at the project root and add the following to the **devDependencies** section: 
>     "gulp": "4.0.2",
>     "gulp-concat": "2.6.1",
>     "gulp-uglify": "3.0.2",
>     "gulp-clean-css": "4.3.0",
>     "del": "6.1.1",
>     "ts-node": "10.9.1"
4. Add/edit file **tsconfig.json** at the project root and add the following to the "include" section:

       "include": [
           "gulpfile.ts"
        ]

6. Add NuGet package **Newtonsoft.Json**
7. Add file [BundleTagHelper.cs](https://github.com/sur1969/BundeMinify/blob/master/BundeMinify/TagHelpers/BundleTagHelper.cs) to folder **TagHelpers** at the project root.
8. Consume this tag helper for your project by editing file **/Pages/_ViewImports.cshtml** and adding:
>  @addTagHelper *, [your project assembly name]
9. Lastly, and I'm not sure why, we need to open the Task Runner Explorer and do this:
find file **Gulpfile.ts** -> right click **bundle-and-minify** -> Bindings -> check that **After Build** is selected.

