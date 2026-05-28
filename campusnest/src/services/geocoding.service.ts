export interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
}

class GeocodingService {
  private readonly NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

  /**
   * Convert an address to coordinates using OpenStreetMap Nominatim
   */
  async geocodeAddress(address: string): Promise<GeocodingResult | null> {
    try {
      const params = new URLSearchParams({
        q: address,
        format: "json",
        limit: "1",
        addressdetails: "1",
      });

      const response = await fetch(`${this.NOMINATIM_URL}?${params}`, {
        headers: {
          "User-Agent": "CampusNest/1.0", // Nominatim requires a User-Agent
        },
      });

      if (!response.ok) {
        console.error("Geocoding API error:", response.statusText);
        return null;
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        console.warn("No geocoding results found for:", address);
        return null;
      }

      const result = data[0];

      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        displayName: result.display_name,
      };
    } catch (error) {
      console.error("Error geocoding address:", error);
      return null;
    }
  }

  /**
   * Geocode multiple addresses with delay to respect rate limits
   * Nominatim has a strict rate limit of 1 request per second
   */
  async geocodeAddresses(
    addresses: string[],
    delayMs: number = 1100,
  ): Promise<Map<string, GeocodingResult>> {
    const results = new Map<string, GeocodingResult>();

    for (const address of addresses) {
      const result = await this.geocodeAddress(address);

      if (result) {
        results.set(address, result);
      }

      // Wait to respect rate limits
      if (addresses.indexOf(address) < addresses.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    return results;
  }

  /**
   * Reverse geocode: convert coordinates to an address
   */
  async reverseGeocode(
    latitude: number,
    longitude: number,
  ): Promise<string | null> {
    try {
      const params = new URLSearchParams({
        lat: latitude.toString(),
        lon: longitude.toString(),
        format: "json",
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?${params}`,
        {
          headers: {
            "User-Agent": "CampusNest/1.0",
          },
        },
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.display_name || null;
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      return null;
    }
  }
}

export const geocodingService = new GeocodingService();
