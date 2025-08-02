use std::env;
use std::path::PathBuf;
use std::process::Command;

fn main() {
    println!("cargo:rerun-if-changed=RyzenAdj");

    // Configure mobile cfg
    println!("cargo::rustc-check-cfg=cfg(mobile)");

    let _out_dir = env::var("OUT_DIR").unwrap();
    let manifest_dir = env::var("CARGO_MANIFEST_DIR").unwrap();

    // Path to RyzenAdj submodule
    let ryzenadj_path = PathBuf::from(&manifest_dir).join("RyzenAdj");
    let build_path = ryzenadj_path.join("build");

    // Check if RyzenAdj is already built
    if !build_path.join("libryzenadj.so").exists() && !build_path.join("libryzenadj.a").exists() {
        // Build RyzenAdj if not already built
        println!("Building RyzenAdj library...");

        // Create build directory
        std::fs::create_dir_all(&build_path).expect("Failed to create build directory");

        // Run cmake
        let cmake_status = Command::new("cmake")
            .current_dir(&build_path)
            .arg("..")
            .status()
            .expect("Failed to run cmake");

        if !cmake_status.success() {
            panic!("cmake failed to configure RyzenAdj");
        }

        // Run make
        let make_status = Command::new("make")
            .current_dir(&build_path)
            .arg("-j")
            .status()
            .expect("Failed to run make");

        if !make_status.success() {
            panic!("make failed to build RyzenAdj");
        }
    }

    // Link to the RyzenAdj library
    println!("cargo:rustc-link-search=native={}", build_path.display());
    println!("cargo:rustc-link-lib=dylib=ryzenadj");

    // On Linux, we also need to link to libpci
    #[cfg(target_os = "linux")]
    println!("cargo:rustc-link-lib=dylib=pci");

    // Set rpath for the built binary to find libryzenadj.so at runtime
    #[cfg(target_os = "linux")]
    println!("cargo:rustc-link-arg=-Wl,-rpath,$ORIGIN");

    // For development, also add the build directory to rpath
    #[cfg(target_os = "linux")]
    println!("cargo:rustc-link-arg=-Wl,-rpath,{}", build_path.display());
}
