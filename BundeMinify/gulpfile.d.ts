type BuildConfigDTO = {
    BuildConfig: string;
}

type BundleConfigDTO = {
    DestFolder: string;
    BundleAndMinifyInDebug: boolean;
    Bundles: BundleDTO[];
}

type BundleDTO = {
    BundleName: string;
    CssSourceFiles?: string[];
    JsSourceFiles?: string[];
}