
import SwissEPH from 'sweph-wasm';

let sweph: SwissEPH | null = null;
let initPromise: Promise<SwissEPH> | null = null;

export const initSwisseph = async () => {
    if (sweph) return sweph;
    if (initPromise) return initPromise;

    // The wasm file is served at /swisseph.wasm
    // The ephe files are at /ephe/
    initPromise = SwissEPH.init('/swisseph.wasm').then(async (instance) => {
        sweph = instance;
        // Set ephemeris path
        // We list the files we have.
        // sweph-wasm documentation says `swe_set_ephe_path` takes a URL and a list of files.
        // This preloads them into WASM memory.
        await sweph.swe_set_ephe_path('/ephe/', [
            'sepl_18.se1',
            'seas_18.se1',
            'semo_18.se1'
        ]);
        return sweph;
    });
    return initPromise;
};

export const calculateChironPosition = async (date: Date): Promise<number> => {
    const sw = await initSwisseph();

    // Convert Date to Julian Day (UT)
    // sw.swe_julday(year, month, day, hour, gregflag)
    // Hour is decimal hour (UT)
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hour = date.getUTCHours() + date.getUTCMinutes()/60.0 + date.getUTCSeconds()/3600.0;

    const jd_ut = sw.swe_julday(year, month, day, hour, sw.SE_GREG_CAL);

    // Calculate Chiron (SE_CHIRON = 15)
    // Flags: SEFLG_SWIEPH (2) | SEFLG_SPEED (256)
    // We want geocentric ecliptic longitude of date? Or J2000?
    // Astronomy-engine returns J2000 or of-date depending on function.
    // My previous code used J2000 mostly but `calculateChart` mixes it.
    // Usually astrologers use Tropical Zodiac (of date).
    // `swe_calc_ut` returns Tropical by default unless SEFLG_SIDEREAL is set.
    // `astronomy-engine`'s `Ecliptic(GeoVector(Body))` usually gives J2000 Ecliptic.
    // But `calculateChart` used `calculateAscendant` which is of-date?
    // "SiderealTime" implies of-date.
    // To match `astronomy-engine` I should check what coordinate system I'm using.
    // `planets` array in `astronomyService.ts`:
    // `const ecliptic = Astronomy.Ecliptic(vector);` where vector is J2000 GeoVector.
    // `Ecliptic()` converts EQJ (J2000) to Ecliptic J2000? No.
    // `Astronomy.Ecliptic` docs: "Converts a J2000 mean equator (EQJ) vector to a true ecliptic of date (ETC) vector and angles."
    // So `astronomy-engine` calculates Tropical (True Ecliptic of Date).
    // So I should use default SwissEPH calculation which is Tropical of Date.

    const flag = sw.SEFLG_SWIEPH | sw.SEFLG_SPEED;

    // ipl 15 is Chiron
    const result = sw.swe_calc_ut(jd_ut, 15, flag);

    // result is [lon, lat, dist, speed_lon, speed_lat, speed_dist]
    // or object depending on binding.
    // `sweph-wasm` returns Array of 6 numbers: CelestialCoordinatesAdvance

    // result[0] is longitude
    return result[0];
};
