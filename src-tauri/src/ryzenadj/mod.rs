//! FFI bindings for RyzenAdj C library
//!
//! This module provides safe Rust bindings to the RyzenAdj library for controlling
//! AMD Ryzen mobile processor power limits and monitoring.

use std::os::raw::{c_float, c_int, c_uint};

/// Opaque handle to RyzenAdj instance
#[repr(C)]
pub struct RyzenAccess {
    _private: [u8; 0],
}

/// AMD Ryzen CPU family enumeration
#[repr(C)]
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum RyzenFamily {
    WaitForLoad = -2,
    Unknown = -1,
    Raven = 0,
    Picasso = 1,
    Renoir = 2,
    Cezanne = 3,
    Dali = 4,
    Lucienne = 5,
    VanGogh = 6,
    Rembrandt = 7,
    Mendocino = 8,
    Phoenix = 9,
    HawkPoint = 10,
    KrackanPoint = 11,
    StrixPoint = 12,
    StrixHalo = 13,
}

/// Error codes returned by RyzenAdj
#[repr(C)]
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum RyzenAdjError {
    FamilyUnsupported = -1,
    SmuTimeout = -2,
    SmuUnsupported = -3,
    SmuRejected = -4,
    MemoryAccess = -5,
}

// External C functions - these will be linked from the RyzenAdj library
#[cfg(not(test))]
#[link(name = "ryzenadj")]
#[allow(dead_code)]
extern "C" {
    fn init_ryzenadj() -> *mut RyzenAccess;
    fn cleanup_ryzenadj(ry: *mut RyzenAccess);
    fn get_cpu_family(ry: *mut RyzenAccess) -> RyzenFamily;
    fn get_bios_if_ver(ry: *mut RyzenAccess) -> c_int;

    // Table functions
    fn init_table(ry: *mut RyzenAccess) -> c_int;
    fn get_table_ver(ry: *mut RyzenAccess) -> c_uint;
    fn get_table_size(ry: *mut RyzenAccess) -> usize;
    fn get_table_values(ry: *mut RyzenAccess) -> *mut c_float;
    fn refresh_table(ry: *mut RyzenAccess) -> c_int;

    // Power limit setters
    fn set_stapm_limit(ry: *mut RyzenAccess, value: c_uint) -> c_int;
    fn set_fast_limit(ry: *mut RyzenAccess, value: c_uint) -> c_int;
    fn set_slow_limit(ry: *mut RyzenAccess, value: c_uint) -> c_int;
    fn set_slow_time(ry: *mut RyzenAccess, value: c_uint) -> c_int;
    fn set_stapm_time(ry: *mut RyzenAccess, value: c_uint) -> c_int;
    fn set_tctl_temp(ry: *mut RyzenAccess, value: c_uint) -> c_int;

    // Current limit setters
    fn set_vrm_current(ry: *mut RyzenAccess, value: c_uint) -> c_int;
    fn set_vrmsoc_current(ry: *mut RyzenAccess, value: c_uint) -> c_int;
    fn set_vrmmax_current(ry: *mut RyzenAccess, value: c_uint) -> c_int;
    fn set_vrmsocmax_current(ry: *mut RyzenAccess, value: c_uint) -> c_int;

    // Temperature limit setters
    fn set_apu_skin_temp_limit(ry: *mut RyzenAccess, value: c_uint) -> c_int;
    fn set_dgpu_skin_temp_limit(ry: *mut RyzenAccess, value: c_uint) -> c_int;

    // Power limit getters
    fn get_stapm_limit(ry: *mut RyzenAccess) -> c_float;
    fn get_stapm_value(ry: *mut RyzenAccess) -> c_float;
    fn get_fast_limit(ry: *mut RyzenAccess) -> c_float;
    fn get_fast_value(ry: *mut RyzenAccess) -> c_float;
    fn get_slow_limit(ry: *mut RyzenAccess) -> c_float;
    fn get_slow_value(ry: *mut RyzenAccess) -> c_float;
    fn get_apu_slow_limit(ry: *mut RyzenAccess) -> c_float;
    fn get_apu_slow_value(ry: *mut RyzenAccess) -> c_float;

    // Temperature getters
    fn get_tctl_temp(ry: *mut RyzenAccess) -> c_float;
    fn get_tctl_temp_value(ry: *mut RyzenAccess) -> c_float;
    fn get_apu_skin_temp_limit(ry: *mut RyzenAccess) -> c_float;
    fn get_apu_skin_temp_value(ry: *mut RyzenAccess) -> c_float;

    // Current getters
    fn get_vrm_current(ry: *mut RyzenAccess) -> c_float;
    fn get_vrm_current_value(ry: *mut RyzenAccess) -> c_float;
    fn get_vrmsoc_current(ry: *mut RyzenAccess) -> c_float;
    fn get_vrmsoc_current_value(ry: *mut RyzenAccess) -> c_float;
    fn get_vrmmax_current(ry: *mut RyzenAccess) -> c_float;
    fn get_vrmmax_current_value(ry: *mut RyzenAccess) -> c_float;
    fn get_vrmsocmax_current(ry: *mut RyzenAccess) -> c_float;
    fn get_vrmsocmax_current_value(ry: *mut RyzenAccess) -> c_float;

    // Clock and power getters
    fn get_core_clk(ry: *mut RyzenAccess, core: c_uint) -> c_float;
    fn get_core_volt(ry: *mut RyzenAccess, core: c_uint) -> c_float;
    fn get_core_power(ry: *mut RyzenAccess, core: c_uint) -> c_float;
    fn get_core_temp(ry: *mut RyzenAccess, core: c_uint) -> c_float;
    fn get_gfx_clk(ry: *mut RyzenAccess) -> c_float;
    fn get_gfx_temp(ry: *mut RyzenAccess) -> c_float;
    fn get_gfx_volt(ry: *mut RyzenAccess) -> c_float;
    fn get_mem_clk(ry: *mut RyzenAccess) -> c_float;
    fn get_fclk(ry: *mut RyzenAccess) -> c_float;
    fn get_soc_power(ry: *mut RyzenAccess) -> c_float;
    fn get_soc_volt(ry: *mut RyzenAccess) -> c_float;
    fn get_socket_power(ry: *mut RyzenAccess) -> c_float;
}

// Mock implementations for testing
#[cfg(test)]
mod mock_ffi {
    use super::*;

    extern "C" {
        pub fn mock_init_ryzenadj() -> *mut RyzenAccess;
        pub fn mock_cleanup_ryzenadj(ry: *mut RyzenAccess);
        pub fn mock_get_cpu_family(ry: *mut RyzenAccess) -> RyzenFamily;
        pub fn mock_get_stapm_limit(ry: *mut RyzenAccess) -> c_float;
        pub fn mock_set_stapm_limit(ry: *mut RyzenAccess, value: c_uint) -> c_int;
        pub fn mock_get_socket_power(ry: *mut RyzenAccess) -> c_float;
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::ptr;
    use std::sync::Mutex;

    // Mock implementation for testing
    #[allow(dead_code)]
    struct MockRyzenAdj {
        initialized: bool,
        cpu_family: RyzenFamily,
        stapm_limit: f32,
        fast_limit: f32,
        slow_limit: f32,
        tctl_temp: f32,
        socket_power: f32,
        vrm_current: f32,
    }

    impl MockRyzenAdj {
        fn new() -> Self {
            Self {
                initialized: false,
                cpu_family: RyzenFamily::Unknown,
                stapm_limit: 0.0,
                fast_limit: 0.0,
                slow_limit: 0.0,
                tctl_temp: 0.0,
                socket_power: 0.0,
                vrm_current: 0.0,
            }
        }
    }

    static MOCK: Mutex<Option<MockRyzenAdj>> = Mutex::new(None);

    // Mock implementations of the C functions for testing
    #[no_mangle]
    extern "C" fn mock_init_ryzenadj() -> *mut RyzenAccess {
        let mut mock = MOCK.lock().unwrap();
        *mock = Some(MockRyzenAdj {
            initialized: true,
            cpu_family: RyzenFamily::Phoenix,
            stapm_limit: 25000.0,
            fast_limit: 30000.0,
            slow_limit: 25000.0,
            tctl_temp: 95.0,
            socket_power: 15.5,
            vrm_current: 45.0,
        });
        // Return a non-null pointer for testing
        0x1 as *mut RyzenAccess
    }

    #[no_mangle]
    extern "C" fn mock_cleanup_ryzenadj(_ry: *mut RyzenAccess) {
        let mut mock = MOCK.lock().unwrap();
        if let Some(ref mut m) = *mock {
            m.initialized = false;
        }
    }

    #[no_mangle]
    extern "C" fn mock_get_cpu_family(ry: *mut RyzenAccess) -> RyzenFamily {
        if ry.is_null() {
            return RyzenFamily::Unknown;
        }
        let mock = MOCK.lock().unwrap();
        mock.as_ref()
            .map(|m| m.cpu_family)
            .unwrap_or(RyzenFamily::Unknown)
    }

    #[no_mangle]
    extern "C" fn mock_get_stapm_limit(_ry: *mut RyzenAccess) -> c_float {
        let mock = MOCK.lock().unwrap();
        mock.as_ref().map(|m| m.stapm_limit).unwrap_or(0.0)
    }

    #[no_mangle]
    extern "C" fn mock_set_stapm_limit(ry: *mut RyzenAccess, value: c_uint) -> c_int {
        if ry.is_null() {
            return -1; // Error
        }
        let mut mock = MOCK.lock().unwrap();
        if let Some(ref mut m) = *mock {
            m.stapm_limit = value as f32;
            return 0; // Success
        }
        -1 // Error
    }

    #[no_mangle]
    extern "C" fn mock_get_socket_power(_ry: *mut RyzenAccess) -> c_float {
        let mock = MOCK.lock().unwrap();
        mock.as_ref().map(|m| m.socket_power).unwrap_or(0.0)
    }

    #[test]
    fn test_ffi_init_and_cleanup() {
        unsafe {
            // Test initialization
            let handle = super::mock_ffi::mock_init_ryzenadj();
            assert!(!handle.is_null());

            // Verify mock was initialized
            {
                let mock = MOCK.lock().unwrap();
                assert!(mock.as_ref().unwrap().initialized);
            }

            // Test cleanup
            super::mock_ffi::mock_cleanup_ryzenadj(handle);

            // Verify mock was cleaned up
            {
                let mock = MOCK.lock().unwrap();
                assert!(!mock.as_ref().unwrap().initialized);
            }
        }
    }

    #[test]
    fn test_ffi_get_cpu_family() {
        unsafe {
            let handle = super::mock_ffi::mock_init_ryzenadj();
            assert!(!handle.is_null());

            let family = super::mock_ffi::mock_get_cpu_family(handle);
            assert_eq!(family, RyzenFamily::Phoenix);

            super::mock_ffi::mock_cleanup_ryzenadj(handle);
        }
    }

    #[test]
    fn test_ffi_power_limits() {
        unsafe {
            let handle = super::mock_ffi::mock_init_ryzenadj();
            assert!(!handle.is_null());

            // Test getting initial value
            let initial_limit = super::mock_ffi::mock_get_stapm_limit(handle);
            assert_eq!(initial_limit, 25000.0);

            // Test setting new value
            let result = super::mock_ffi::mock_set_stapm_limit(handle, 30000);
            assert_eq!(result, 0); // Success

            // Verify the value was set
            let new_limit = super::mock_ffi::mock_get_stapm_limit(handle);
            assert_eq!(new_limit, 30000.0);

            super::mock_ffi::mock_cleanup_ryzenadj(handle);
        }
    }

    #[test]
    fn test_ffi_monitoring_values() {
        unsafe {
            let handle = super::mock_ffi::mock_init_ryzenadj();
            assert!(!handle.is_null());

            // Test getting socket power
            let power = super::mock_ffi::mock_get_socket_power(handle);
            assert_eq!(power, 15.5);

            super::mock_ffi::mock_cleanup_ryzenadj(handle);
        }
    }

    #[test]
    fn test_ffi_null_pointer_handling() {
        unsafe {
            // Test with null pointer
            let family = super::mock_ffi::mock_get_cpu_family(ptr::null_mut());
            assert_eq!(family, RyzenFamily::Unknown);

            let result = super::mock_ffi::mock_set_stapm_limit(ptr::null_mut(), 25000);
            assert_eq!(result, -1); // Error
        }
    }

    #[test]
    fn test_ryzen_family_enum_values() {
        // Verify enum values match C header
        assert_eq!(RyzenFamily::WaitForLoad as i32, -2);
        assert_eq!(RyzenFamily::Unknown as i32, -1);
        assert_eq!(RyzenFamily::Raven as i32, 0);
        assert_eq!(RyzenFamily::Phoenix as i32, 9);
        assert_eq!(RyzenFamily::StrixHalo as i32, 13);
    }

    #[test]
    fn test_ryzen_adj_error_enum_values() {
        // Verify error enum values match C header
        assert_eq!(RyzenAdjError::FamilyUnsupported as i32, -1);
        assert_eq!(RyzenAdjError::SmuTimeout as i32, -2);
        assert_eq!(RyzenAdjError::SmuUnsupported as i32, -3);
        assert_eq!(RyzenAdjError::SmuRejected as i32, -4);
        assert_eq!(RyzenAdjError::MemoryAccess as i32, -5);
    }
}
