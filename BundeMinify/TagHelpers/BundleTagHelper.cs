using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Newtonsoft.Json;

namespace BundeMinify.TagHelpers
{
    public class BundleTagHelper : TagHelper
    {
        private readonly IFileVersionProvider _fileVersionProvider;

        private static BuildConfigDTO? _gulpfileBuildConfig;
        private static BundleConfigDTO? _gulpfileBundleConfig;

        private bool _bundledAndMinified;

        public BundleTagHelper(IFileVersionProvider fileVersionProvider)
        {
            _fileVersionProvider = fileVersionProvider;

            // read file gulpfileBuildConfig.json - always read in debug mode

            if (_gulpfileBuildConfig == null || _gulpfileBuildConfig!.BuildConfig.StartsWith("Debug"))
            {
                _gulpfileBuildConfig = ReadJsonFile<BuildConfigDTO>("gulpfileBuildConfig.json");
            }


            // read file gulpfileBundleConfig.json - always read in debug mode

            if (_gulpfileBundleConfig == null || _gulpfileBuildConfig!.BuildConfig.StartsWith("Debug"))
            {
                _gulpfileBundleConfig = ReadJsonFile<BundleConfigDTO>("gulpfileBundleConfig.json");
                _bundledAndMinified = _gulpfileBundleConfig.BundleAndMinifyInDebug || !_gulpfileBuildConfig!.BuildConfig.StartsWith("Debug");
            }
        }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            string bundleName = output.Attributes["bundleName"]?.Value.ToString()?.ToLower() ?? "";
            if (string.IsNullOrWhiteSpace(bundleName))
            {
                throw new Exception("bundleName is a required attribute");
            }

            string bundleType = output.Attributes["bundleType"]?.Value.ToString()?.ToLower() ?? "";
            if (string.IsNullOrWhiteSpace(bundleType) && bundleType != "css" && bundleType != "js")
            {
                throw new Exception("bundleType is a required attribute and must be either css or js");
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
                throw new Exception($"{fileName} not found");
            }
            string json = File.ReadAllText(filePath);
            return JsonConvert.DeserializeObject<T>(json)!;
        }

        private static BundleDTO GetBundle(string bundleName, string bundleType)
        {
            try
            {
                var bundles = _gulpfileBundleConfig!.Bundles;
                if (bundles == null || bundles.Length == 0)
                {
                    throw new Exception("No bundles found in gulpfileBundleConfig.json");
                }

                var bundle = bundles.FirstOrDefault(b => b.BundleName.ToLower() == bundleName);
                if (bundle == null ||
                    (bundleType == "css" && bundle.CssSourceFiles.Length == 0) ||
                    (bundleType == "js" && bundle.JsSourceFiles.Length == 0))
                {
                    throw new Exception($"Could not find {bundleType} bundle with name {bundleName}");
                }

                return bundle;
            }
            catch (Exception)
            {
                throw new Exception("Could not read gulpfileBundleConfig.json");
            }
        }

        private string CreateCssTags(BundleDTO bundle)
        {
            string html = "";

            if (_bundledAndMinified)
            {
                string href = $"{RemoveWwwrootFromPath(_gulpfileBundleConfig!.DestFolder)}/{bundle.BundleName}.min.css";
                href = _fileVersionProvider.AddFileVersionToPath(null, href);
                html = $"<link rel='stylesheet' href='{href}'>";
            }
            else
            {
                foreach (string sourceFile in bundle.CssSourceFiles)
                {
                    string href = RemoveWwwrootFromPath(sourceFile);
                    href = _fileVersionProvider.AddFileVersionToPath(null, href);
                    html += $"<link rel='stylesheet' href='{href}'>" + Environment.NewLine;
                }
            }

            return html;
        }

        private string CreateJsTags(BundleDTO bundle)
        {
            string html = "";

            if (_bundledAndMinified)
            {
                string src = $"{RemoveWwwrootFromPath(_gulpfileBundleConfig!.DestFolder)}/{bundle.BundleName}.min.js";
                src = _fileVersionProvider.AddFileVersionToPath(null, src);
                html = $"<script src='{src}'></script>";
            }
            else
            {
                foreach (string sourceFile in bundle.JsSourceFiles)
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
        public string BundleName { get; set; } = "";
        public string[] CssSourceFiles { get; set; } = Array.Empty<string>();
        public string[] JsSourceFiles { get; set; } = Array.Empty<string>();
    }
}