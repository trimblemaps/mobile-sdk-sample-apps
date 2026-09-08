const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");
const {
  buildExtraNodeModules,
  buildLocalPackageMetroConfig,
} = require("./resolve-local-packages");

const root = path.resolve(__dirname, "..");
const trimblePackages = [
  "@trimblemaps/account-react-native",
  "@trimblemaps/maps-react-native",
  "@trimblemaps/services-react-native",
  "@trimblemaps/plugins-react-native",
];

function resolveLocalPackageModule(
  context,
  moduleName,
  platform,
  localPackages,
  resolve,
) {
  for (const [packageName, packageRoot] of Object.entries(localPackages)) {
    if (moduleName === packageName) {
      const entryCandidates = [
        path.join(packageRoot, "src/index.ts"),
        path.join(packageRoot, "src/index.tsx"),
        path.join(packageRoot, "index.js"),
        path.join(packageRoot, "src/index.js"),
      ];

      for (const entry of entryCandidates) {
        if (fs.existsSync(entry)) {
          return resolve(
            {
              ...context,
              originModulePath: path.join(packageRoot, "package.json"),
            },
            entry,
            platform,
          );
        }
      }
    }

    const prefix = `${packageName}/`;
    if (moduleName.startsWith(prefix)) {
      const subpath = moduleName.slice(prefix.length);
      const base = path.join(packageRoot, subpath);
      const candidates = [
        `${base}.ts`,
        `${base}.tsx`,
        `${base}.js`,
        path.join(base, "index.ts"),
        path.join(base, "index.tsx"),
        path.join(base, "index.js"),
      ];

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          return resolve(
            {
              ...context,
              originModulePath: path.join(packageRoot, "package.json"),
            },
            candidate,
            platform,
          );
        }
      }
    }
  }

  return null;
}

function withMetroShared(config, { project }) {
  const projectRequire = createRequire(path.join(project, "package.json"));
  const { withMetroConfig } = projectRequire("react-native-monorepo-config");
  const {
    wrapWithReanimatedMetroConfig,
  } = projectRequire("react-native-reanimated/metro-config");

  const searchPaths = [project, root];
  const metroConfig = wrapWithReanimatedMetroConfig(
    withMetroConfig(config, {
      root,
      dirname: project,
      workspaces: ["apps/*"],
    }),
  );

  const localPackages = buildExtraNodeModules(root, trimblePackages, searchPaths);
  const localPackageNames = Object.keys(localPackages);
  const localPackagePaths = Object.values(localPackages);
  const { pinnedNodeModules, blockList: localPackageBlockList } =
    buildLocalPackageMetroConfig({
      project,
      repoRoot: root,
      localPackagePaths,
    });

  const conditionNames = new Set(
    metroConfig.resolver?.unstable_conditionNames ?? ["react-native"],
  );
  conditionNames.add("source");

  const previousResolveRequest = metroConfig.resolver?.resolveRequest;

  return {
    ...metroConfig,
    watchFolders: [...(metroConfig.watchFolders ?? []), ...localPackagePaths],
    resolver: {
      ...metroConfig.resolver,
      blockList: [
        ...[metroConfig.resolver?.blockList].flat().filter(Boolean),
        ...localPackageBlockList,
      ],
      unstable_conditionNames: [...conditionNames],
      extraNodeModules: {
        ...metroConfig.resolver?.extraNodeModules,
        ...pinnedNodeModules,
        ...localPackages,
      },
      resolveRequest: (originalContext, moduleName, platform) => {
        const resolve = (context, name, targetPlatform) => {
          if (previousResolveRequest) {
            return previousResolveRequest(context, name, targetPlatform);
          }

          return context.resolveRequest(context, name, targetPlatform);
        };

        const localResolution = resolveLocalPackageModule(
          originalContext,
          moduleName,
          platform,
          localPackages,
          resolve,
        );
        if (localResolution) {
          return localResolution;
        }

        let context = originalContext;

        if (
          localPackageNames.some(
            (name) => moduleName === name || moduleName.startsWith(`${name}/`),
          )
        ) {
          context = {
            ...context,
            mainFields: [
              "react-native",
              "source",
              ...(context.mainFields ?? []),
            ],
            unstable_conditionNames: [
              "react-native",
              "source",
              ...(context.unstable_conditionNames ?? []),
            ],
          };
        }

        return resolve(context, moduleName, platform);
      },
    },
  };
}

module.exports = { withMetroShared };
