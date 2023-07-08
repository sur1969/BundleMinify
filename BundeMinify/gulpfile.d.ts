type BuildConfigDTO = {
    BuildConfig: string;
}

type BundleConfigDTO = {
    DestFolder: string;
    BundleAndMinifyInDebug: boolean;
    Bundles: BundleDTO[];
}

type BundleDTO = {
    Name: string;
    CssFiles?: string[];
    JsFiles?: string[];
}