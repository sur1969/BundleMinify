# Bundle & Minify Css and Javascript

The .net 7.0 bundling & minification solution didn't work - I'm looking at you WebOptimizer. Our requirement was simple, bundle & minify files in Release config and **do not** when in Debug config.

## How to get it working!

Add a **bundle** tag to your .cshtml page to reference a css or javascript bundle. e.g.

	For css:	<bundle name="site" type="css"></bundle>
	For js:		<bundle name="site" type="js"></bundle>
When bundled this will output:

    <link rel="stylesheet" href="Bundles/site.min.css?v=...">
    <script src="Bundles/site.min.js?v=..."></script>

Add [gulpfileBundleConfig.json](https://github.com/sur1969/BundeMinify/blob/master/BundeMinify/gulpfileBundleConfig.json) to the root of your project containing the bundle data, e.g.:

    {
      "BundleFolder": "wwwroot/Bundles",
      "BundleConfigs": [ "Release" ], 
    
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
 
*Note, wildcards in file paths are not supported. Any updates to this file will **require a Rebuild** for any changes to take effect.*  
**BundleFolder** : the folder that bundles will be saved to.  
**BundleConfigs** : the configurations when bundling will happen. By adding "Debug" to this list you can view bundling in action while in the Debug configuration.  
**Bundles** : the list of bundles. Each bundle should have a unique name. A bundle can consist of either or both of CssFile and JsFiles.  

## The painful part follows but only needs to be done once:

1. Add files [gulpfile.d.ts](https://github.com/sur1969/BundeMinify/blob/master/BundeMinify/gulpfile.d.ts)  and [gulpfile.ts](https://github.com/sur1969/BundeMinify/blob/master/BundeMinify/gulpfile.ts) to the root of your project
2. Add Pre-build event to store build configuration i.e. Debug or Release :

> Right click project -> Properties -> Build -> Events -> Pre-build
> event -> enter the following command:
> 
>      echo {"BuildConfig" : "$(ConfigurationName)"} > ./gulpfileBuildConfig.json
**IMPORTANT :**  pre/post build events don’t run when the project is considered up-to-date. When you change from Debug to Release or vice versa, **you will need to do a Rebuild**.

Alternatively, to always run pre/post build events you should unload the project and add the following to the PropertyGroup section:

      <DisableFastUpToDateCheck>true</DisableFastUpToDateCheck>

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

5. Add NuGet package **Newtonsoft.Json**
6. Add file [BundleTagHelper.cs](https://github.com/sur1969/BundeMinify/blob/master/BundeMinify/TagHelpers/BundleTagHelper.cs) to folder **TagHelpers** at the project root. **Update namespace** to match your project.
   Consume tag helpers for your project by editing file **/Pages/_ViewImports.cshtml** and adding:
>  @addTagHelper *, [your project assembly name]
7. Lastly, check the "bundle-and-minify" gulp task is setup correctly:  
Open **Task Runner Explorer** -> Gulpfile.ts -> Tasks -> right click **bundle-and-minify** -> Bindings -> check that **After Build** is selected.
