import * as core from "@actions/core"
import { VERSION } from "./meta.js";

export const RECOGNIZED_VERSION_REQUIREMENTS = ["any-supported", "any-latest-supported", "latest-supported"];

/**
 * Retrieves the most recent supported Go versions.
 *
 * @returns Array of version strings.
 */
export async function latestSupportedGoVersions() {
  try {
    const response = await fetch(`https://go.dev/dl/?mode=json`, {
      headers: {
        "User-Agent": `go-supported-version-check-action/${VERSION}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.map((gv) => gv.version.replace("go", ""));
  } catch (error) {
    console.error("Error fetching or parsing JSON:", error);
    throw error;
  }
}

/**
 * Determines if provided Go version is still supported.
 *
 * From https://go.dev/doc/devel/release:
 *
 * > Each major Go release is supported until there are two newer major releases.
 * > For example, Go 1.5 was supported until the Go 1.7 release, and Go 1.6 was
 * > supported until the Go 1.8 release. We fix critical problems, including critical
 * > security problems, in supported releases as needed by issuing minor revisions
 * > (for example, Go 1.6.1, Go 1.6.2, and so on).
 *
 * @param versionToCheck The Go version to check (major.minor.patch format).
 * @param versionRequirement The rules used to determine if the version meets the requirement (must be one of RECOGNIZED_VERSION_REQUIREMENTS).
 * @returns Boolean indicating whether the provided Go version is still supported or not.
 */
export async function meetsVersionRequirements(versionToCheck, versionRequirement) {
  const latestSupportedVersions = await latestSupportedGoVersions();
  core.debug(`Latest Supported Versions: ${latestSupportedVersions}...`);
  const checkVersionMajor = versionToCheck.split(".").slice(0, 2).join(".");

  let meetsRequirement = false;
  switch (versionRequirement) {
    case "any-latest-supported":
      core.debug(`Checking version using 'any-latest-supported' version requirement`);
      meetsRequirement = latestSupportedVersions.some((lv) => {
        core.debug(`Checking against supported version ${lv}...`);

        if (versionToCheck === lv) {
          core.debug(`Direct match: ${versionToCheck} === ${lv}`);
          return true;
        }

        return false;
      })
      break;
    case "latest-supported":
      core.debug(`Checking version using 'latest-supported' version requirement`);
      core.debug(`Checking ${versionToCheck} against latest supported version ${latestSupportedVersions[0]}...`);
      meetsRequirement = versionToCheck === latestSupportedVersions[0];
      break;
    case "any-supported":
    default:
      core.debug(`Checking version using 'any-supported' version requirement`);
      meetsRequirement = latestSupportedVersions.some((lv) => {
        const supportedVersionMajor = lv.split(".").slice(0, 2).join(".");
        core.debug(`Checking ${checkVersionMajor} against supported version series ${supportedVersionMajor}...`);

        if (checkVersionMajor === supportedVersionMajor) {
          core.debug(`Major version match: ${checkVersionMajor} === ${supportedVersionMajor}`);
          return true;
        }

        return false;
      })
      break;
  }

  return meetsRequirement;
}
