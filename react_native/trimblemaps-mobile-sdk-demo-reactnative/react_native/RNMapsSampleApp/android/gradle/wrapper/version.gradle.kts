import java.io.ByteArrayOutputStream

fun String.runCommand(currentWorkingDir: File = file("./")): String {
    val byteOut = ByteArrayOutputStream()
    project.exec {
        workingDir = currentWorkingDir
        commandLine = this@runCommand.split("\\s".toRegex())
        standardOutput = byteOut
    }
    return String(byteOut.toByteArray()).trim()
}

fun getVersion(gitDescribe: String, refLog: String) : String {
    val regex = """^(\D*)-(\d*)\.(\d*)(?:\.?(\d*))(?:-?(\d*)-g.{4,})?""".toRegex()
    val matchResult = regex.find(gitDescribe)
    var (tag, major, minor, patch, commits) = matchResult!!.destructured

    //in case the tag only had major.minor
    if (patch.isEmpty()) patch = "0"

    //Leaving in for easy debugging
//    println("tag: [$tag] version: [${major}.${minor}.${patch}] commits: [$commits]")
//    println("\trefLog: $refLog")

    if (tag == "master" && commits.isEmpty()) commits = "0"

    if (commits.isEmpty()) {
        return "${major}.${minor}.${patch}"
    } else {

        if (tag == "master") {
            patch = 0.toString()
        } else if (refLog.contains("origin/release/")) {
            patch = "${patch.toInt() + 1}"
        } else {
            minor = "${minor.toInt() + 1}"
            patch = 0.toString()
        }

        return "$major.$minor.$patch-$commits"
    }
}

inline fun <T> assertEquals(expected: T, actual: T, message: String? = null) {
    if(expected != actual) {
        var text = message ?: "Assertion Failed: expected ($expected)  does not equal actual ($actual)"
        println(text)
        throw GradleException(text)
    }
}

extra.apply {
    var gitDescribe = "git describe --first-parent @".runCommand()

    set("versionName", "")
    set("versionCode", "")

    try {
        // We want to find the lastest instance of  master or release so we know what branch we're on
        val gitLog = "git --no-pager log -n 50 --pretty=%D HEAD".runCommand()
            .lines()
            .mapNotNull { it.findAnyOf(listOf("origin/master", "origin/release/"))?.second }
            .first()

        val versionName = getVersion(gitDescribe, gitLog)
        version = versionName
        set("versionName", versionName)

        val regex = """^(\d*)\.(\d*)\.?(\d*)(?:-?(\d*))?""".toRegex()
        val matchResult = regex.find(versionName)
        val (major, minor, patch, buildNumber) = matchResult!!.destructured

        //Maximum 2100000000
        //         ^^ major
        //           ^^ minor
        //             ^^ patch
        //               ^^^ buildnumber

        val versionCode = "%1$2s%2$2s%3$2s%4$3s".format(major, minor, patch, buildNumber).replace(" ", "0").toInt()
        set("versionCode", versionCode)
    } catch (e: NoSuchElementException) {
        throw NoSuchElementException("Current branch is behind master, please rebase off master then gradle sync")
    }
}

task("printVersion") {
    dependsOn("testVersion")
    println("VersionName: ${rootProject.extra["versionName"]}")
    println("VersionCode: ${rootProject.extra["versionCode"]}")
}

task("testVersion") {
    // Here we expect the tagged commit to be a release version.
    // Any commit after that bump the patch version (release branch) or the
    // minor version over the tagged value. If the minor version is bumped, the patch
    // is set to 0.
    assertEquals("1.2.4-41",
        getVersion("version-1.2.3-41-g814236a3", "origin/release/order_66"))
    assertEquals("1.3.0-41",
        getVersion("version-1.2.3-41-g814236a3", "origin/master"))
    assertEquals("1.2.3",
        getVersion("version-1.2.3", "origin/release/order_66"))
    assertEquals("1.2.3",
        getVersion("version-1.2.3", "origin/master"))

    // If the prefix is master, we don't bump anything and always include the build number.
    // We also assume patch to 0. We expect to use a master tag the commit after branching
    // for release if a release commit has not been set.
    assertEquals("1.2.0-41",
        getVersion("master-1.2.0-41-g814236a3", "origin/release/order_66"))
    assertEquals("1.2.0-41",
        getVersion("master-1.2.3-41-g814236a3", "origin/master"))
    assertEquals("1.2.0-0",
        getVersion("master-1.2.0", "origin/release/order_66"))
    assertEquals("1.2.0-0",
        getVersion("master-1.2.0", "origin/master"))

    // Here we check the handling of major.minor tags. In this case we assumed patch to be 0.
    assertEquals("1.2.0-41",
        getVersion("master-1.2-41-g814236a3", "origin/release/order_66"))
    assertEquals("1.2.0-41",
        getVersion("master-1.2-41-g814236a3", "origin/master"))
    assertEquals("1.2.0-0",
        getVersion("master-1.2", "origin/release/order_66"))
    assertEquals("1.2.0-0",
        getVersion("master-1.2", "origin/master"))
}