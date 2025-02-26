const __PROJECT_PATH = "";
const __RUNTIME_ID = "";
const __BUILD_DIRECTORY = "";

const __RUNTIME_CONTEXT = {
    project_path: __PROJECT_PATH,
    runtime_id: __RUNTIME_ID,
    ssjs_context: {
        decorator: OpenCodeLibrary(UrlAppendPath(UrlAppendPath(__PROJECT_PATH, __BUILD_DIRECTORY), "bin/ssjs/__decorator.js"))
    }
};
