import { useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { Country, State, City } from "country-state-city";
import { cn } from "@/lib/utils";

interface LocationFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const LocationField = ({ value, onChange, className }: LocationFieldProps) => {
  const [countryCode, setCountryCode] = useState<string>("");
  const [stateCode, setStateCode] = useState<string>("");
  const [cityName, setCityName] = useState<string>("");
  const [initialized, setInitialized] = useState(false);

  const countries = useMemo(() => Country.getAllCountries(), []);

  const states = useMemo(
    () => (countryCode ? State.getStatesOfCountry(countryCode) : []),
    [countryCode]
  );

  const cities = useMemo(
    () => (countryCode && stateCode ? City.getCitiesOfState(countryCode, stateCode) : []),
    [countryCode, stateCode]
  );

  // Initialize selectors from existing "City, State, Country" value
  useEffect(() => {
    if (!value || initialized) return;

    const parts = value.split(",").map((p) => p.trim()).filter(Boolean);
    if (!parts.length) {
      setInitialized(true);
      return;
    }

    const countryName = parts[parts.length - 1];
    const stateName = parts.length >= 3 ? parts[parts.length - 2] : "";
    const cityPart = parts[0];

    const country = countries.find((c) => c.name === countryName);
    if (country) {
      setCountryCode(country.isoCode);

      if (stateName) {
        const countryStates = State.getStatesOfCountry(country.isoCode);
        const matchedState = countryStates.find((s) => s.name === stateName);
        if (matchedState) {
          setStateCode(matchedState.isoCode);
        }
      }
    }

    if (cityPart) {
      setCityName(cityPart);
    }

    setInitialized(true);
  }, [value, countries, initialized]);

  // Keep combined string in sync with chosen country/state/city
  useEffect(() => {
    if (!countryCode && !stateCode && !cityName) {
      if (value) {
        onChange("");
      }
      return;
    }

    const country = countryCode ? Country.getCountryByCode(countryCode) : null;
    const state =
      countryCode && stateCode
        ? State.getStateByCodeAndCountry(stateCode, countryCode)
        : null;

    const parts = [cityName, state?.name, country?.name].filter(Boolean);
    const next = parts.join(", ");

    if (next !== value) {
      onChange(next);
    }
  }, [countryCode, stateCode, cityName, onChange, value]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--navy-deep))]/60" />
        <Select
          value={countryCode}
          onValueChange={(code) => {
            setCountryCode(code);
            setStateCode("");
            setCityName("");
          }}
        >
          <SelectTrigger className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] pl-10">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-[hsl(var(--navy-deep))]/10 max-h-72">
            {countries.map((country) => (
              <SelectItem
                key={country.isoCode}
                value={country.isoCode}
                className="text-[hsl(var(--navy-deep))]"
              >
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {states.length > 0 && (
        <Select
          value={stateCode}
          onValueChange={(code) => {
            setStateCode(code);
            setCityName("");
          }}
        >
          <SelectTrigger className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))]">
            <SelectValue placeholder="Select state / region (if applicable)" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-[hsl(var(--navy-deep))]/10 max-h-72">
            {states.map((state) => (
              <SelectItem
                key={state.isoCode}
                value={state.isoCode}
                className="text-[hsl(var(--navy-deep))]"
              >
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {countryCode && (
        <Select
          value={cityName}
          onValueChange={(name) => {
            setCityName(name);
          }}
        >
          <SelectTrigger className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))]">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-[hsl(var(--navy-deep))]/10 max-h-72">
            {cities.map((city) => (
              <SelectItem
                key={`${city.name}-${city.stateCode}-${city.countryCode}`}
                value={city.name}
                className="text-[hsl(var(--navy-deep))]"
              >
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

