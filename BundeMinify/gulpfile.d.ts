type BuildConfigDTO = {
    BuildConfig: string;
}

type BundleConfigDTO = {
    BundleFolder: string;
    BundleConfigs: string[];
    Bundles: BundleDTO[];
}

type BundleDTO = {
    Name: string;
    CssFiles?: string[];
    JsFiles?: string[];
}