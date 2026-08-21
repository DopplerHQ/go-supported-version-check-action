import * as core from "@actions/core"
import { meetsVersionRequirements, RECOGNIZED_VERSION_REQUIREMENTS } from "./go-versions.js"

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run() {
  try {
    core.debug(new Date().toTimeString())
    const versionToCheck = core.getInput("go-version")

    const versionRequirement = core.getInput("version-requirement")
    if (!RECOGNIZED_VERSION_REQUIREMENTS.includes(versionRequirement)) {
      core.debug(`Unrecognized version-requirement: ${versionRequirement}`)
      core.setFailed(`'version-requirement' must be one of: ${RECOGNIZED_VERSION_REQUIREMENTS.join(",")}`)
      process.exit();
    }

    core.debug(`Checking if ${versionToCheck} is still supported...`)
    const meetsRequirement = await meetsVersionRequirements(versionToCheck, versionRequirement)
    if (!meetsRequirement) {
      core.setFailed(`${versionToCheck} doesn't meet version requirement: ${versionRequirement}`)
      process.exit();
    }
    core.debug(`${versionToCheck} meets version requirement: ${versionRequirement}`)
    core.debug(new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.setFailed(error.message)
      process.exit();
    }
  }
}
