using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Newtonsoft.Json;

namespace BundeMinify.TagHelpers
{
    public class BundleTagHelper : TagHelper
    {
        private static BuildConfigDTO? _buildConfig; // this will tell us which configuration we're in i.e Debug or Release
        private static BundleConfigDTO? _bundleConfig;  // this will hold the bundles
        private bool _bundledAndMinified;

        private readonly IFileVersionProvider _fileVersionProvider;

        public BundleTagHelper(IFileVersionProvider fileVersionProvider)
        {
            _fileVersionProvider = fileVersionProvider;

            // read gulpfileBuildConfig.json - always read in debug mode

            if (_buildConfig == null || _buildConfig!.BuildConfig.StartsWith("Debug"))
            {
                _buildConfig = ReadJsonFile<BuildConfigDTO>("gulpfileBuildConfig.json");
            }


            // read gulpfileBundleConfig.json - always read in debug mode

            if (_bundleConfig == null || _buildConfig!.BuildConfig.StartsWith("Debug"))
            {
                _bundleConfig = ReadJsonFile<BundleConfigDTO>("gulpfileBundleConfig.json");
            }

            _bundledAndMinified = _bundleConfig.BundleAndMinifyInDebug || !_buildConfig!.BuildConfig.StartsWith("Debug");
        }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            string bundleName = output.Attributes["name"]?.Value.ToString()?.ToLower() ?? "";
            if (string.IsNullOrWhiteSpace(bundleName))
            {
                throw new Exception("'name' attribute missing from bundle tag");
            }

            string bundleType = output.Attributes["type"]?.Value.ToString()?.ToLower() ?? "";
            if (string.IsNullOrWhiteSpace(bundleType) && bundleType != "css" && bundleType != "js")
            {
                throw new Exception("'type' attribute missing from bundle tag - must be either css or js");
            }

            BundleDTO bundle = GetBundle(bundleName, bundleType);

            string html = "";
            switch (bundleType)
            {
                case "css": html += CreateCssTags(bundle); break;
                case "js": html += CreateJsTags(bundle); break;
            }

            output.TagName = null;
            output.Content.SetHtmlContent(html);
        }

        private static T ReadJsonFile<T>(string fileName)
        {
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), fileName);
            if (!File.Exists(filePath))
            {
                throw new Exception($"'{fileName}' not found");
            }
            string json = File.ReadAllText(filePath);
            return JsonConvert.DeserializeObject<T>(json)!;
        }

        private static BundleDTO GetBundle(string bundleName, string bundleType)
        {
            var bundles = _bundleConfig!.Bundles;
            if (bundles == null || bundles.Length == 0)
            {
                throw new Exception("No bundles found in 'gulpfileBundleConfig.json'");
            }

            var bundle = bundles.FirstOrDefault(b => b.Name.ToLower() == bundleName);
            if (bundle == null ||
                (bundleType == "css" && bundle.CssFiles.Length == 0) ||
                (bundleType == "js" && bundle.JsFiles.Length == 0))
            {
                throw new Exception($"Could not find {bundleType} bundle with name '{bundleName}'");
            }

            return bundle;
        }


        /*
            CSS
        */

        private string CreateCssTags(BundleDTO bundle)
        {
            string html = "";

            if (_bundledAndMinified)
            {
                string href = $"{RemoveWwwrootFromPath(_bundleConfig!.DestFolder)}/{bundle.Name}.min.css";
                href = _fileVersionProvider.AddFileVersionToPath(null, href);
                html = $"<link rel='stylesheet' href='{href}'>";
            }
            else
            {
                foreach (string sourceFile in bundle.CssFiles)
                {
                    string href = RemoveWwwrootFromPath(sourceFile);
                    href = _fileVersionProvider.AddFileVersionToPath(null, href);
                    html += $"<link rel='stylesheet' href='{href}'>" + Environment.NewLine;
                }
            }

            return html;
        }


        /*
            JAVASCRIPT
        */

        private string CreateJsTags(BundleDTO bundle)
        {
            string html = "";

            if (_bundledAndMinified)
            {
                string src = $"{RemoveWwwrootFromPath(_bundleConfig!.DestFolder)}/{bundle.Name}.min.js";
                src = _fileVersionProvider.AddFileVersionToPath(null, src);
                html = $"<script src='{src}'></script>";
            }
            else
            {
                foreach (string sourceFile in bundle.JsFiles)
                {
                    string src = RemoveWwwrootFromPath(sourceFile);
                    src = _fileVersionProvider.AddFileVersionToPath(null, src);
                    html += $"<script src='{src}'></script>" + Environment.NewLine;
                }
            }

            return html;
        }

        private static string RemoveWwwrootFromPath(string path) => path.Replace("wwwroot/", "");
    }


    /*
        DTOs
    */

    public class BuildConfigDTO
    {
        public string BuildConfig { get; set; } = "";
    }

    public class BundleConfigDTO
    {
        public string DestFolder { get; set; } = "";
        public bool BundleAndMinifyInDebug { get; set; }
        public BundleDTO[] Bundles { get; set; } = Array.Empty<BundleDTO>();
    }

    public class BundleDTO
    {
        public string Name { get; set; } = "";
        public string[] CssFiles { get; set; } = Array.Empty<string>();
        public string[] JsFiles { get; set; } = Array.Empty<string>();
    }
}