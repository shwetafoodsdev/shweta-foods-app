"use client";

import { useActionState, useMemo, useState } from "react";
import { City, Country, State } from "country-state-city";

type ShippingFormState = { success: boolean; message?: string } | null;

type ShippingAddressFormProps = {
  initialShipping: Record<string, string>;
  action: (
    state: ShippingFormState | void,
    formData: FormData
  ) => Promise<ShippingFormState | void>;
};

const ShippingAddressForm = ({ initialShipping, action }: ShippingAddressFormProps) => {
  const [formState, formAction, isPending] = useActionState(action, null);
  const countries = useMemo(() => Country.getAllCountries(), []);
  const indiaCountry = useMemo(
    () => countries.find((country) => country.name === "India"),
    [countries]
  );
  const defaultCountry = useMemo(() => {
    return (
      countries.find((country) => country.name === initialShipping.country)?.isoCode ??
      indiaCountry?.isoCode ??
      "IN"
    );
  }, [countries, indiaCountry, initialShipping.country]);

  const [countryCode, setCountryCode] = useState(defaultCountry);

  const states = useMemo(() => State.getStatesOfCountry(countryCode), [countryCode]);
  const defaultState = useMemo(() => {
    const fromInitial =
      states.find((stateItem) => stateItem.name === initialShipping.state)?.isoCode ?? "";
    const rajasthanCode =
      states.find((stateItem) => stateItem.name === "Rajasthan")?.isoCode ?? "";
    return fromInitial || rajasthanCode || states[0]?.isoCode || "";
  }, [states, initialShipping.state]);

  const [stateCode, setStateCode] = useState(defaultState);
  const cities = useMemo(() => {
    if (stateCode) return City.getCitiesOfState(countryCode, stateCode) ?? [];
    return City.getCitiesOfCountry(countryCode) ?? [];
  }, [countryCode, stateCode]);
  const defaultCity = useMemo(() => {
    const fromInitial = cities.find((city) => city.name === initialShipping.city)?.name ?? "";
    const bikanerName = cities.find((city) => city.name === "Bikaner")?.name ?? "";
    return fromInitial || bikanerName || cities[0]?.name || "";
  }, [cities, initialShipping.city]);
  const [cityName, setCityName] = useState(defaultCity);

  const selectedCountry = countries.find((country) => country.isoCode === countryCode);
  const defaultDialCode = selectedCountry?.phonecode
    ? `+${selectedCountry.phonecode}`
    : initialShipping.countryCode || "+91";
  const [dialCode, setDialCode] = useState(defaultDialCode);
  const dialCodeOptions = useMemo(() => {
    return countries.map((country) => ({
      key: `${country.isoCode}-${country.phonecode}`,
      value: `+${country.phonecode}`,
      label: `${country.name} (+${country.phonecode})`,
    }));
  }, [countries]);

  return (
    <form action={formAction} className="theme-surface mt-6 space-y-4 rounded-xl border p-6">
      {(() => {
        const fieldClass =
          "w-full rounded border border-border/70 bg-muted/40 px-3 py-2 text-foreground outline-none transition-colors focus:border-primary/50";
        return (
          <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">First Name *</label>
          <input
            className={fieldClass}
            name="firstName"
            defaultValue={initialShipping.firstName || ""}
            autoComplete="given-name"
            pattern="^[A-Za-z]+(?:[ '-][A-Za-z]+)*$"
            minLength={2}
            maxLength={40}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Last Name *</label>
          <input
            className={fieldClass}
            name="lastName"
            defaultValue={initialShipping.lastName || ""}
            autoComplete="family-name"
            pattern="^[A-Za-z]+(?:[ '-][A-Za-z]+)*$"
            minLength={2}
            maxLength={40}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">Country *</label>
          <select
            className={fieldClass}
            name="country"
            value={selectedCountry?.name || ""}
            onChange={(event) => {
              const selected = countries.find((country) => country.name === event.target.value);
              if (!selected) return;
              setCountryCode(selected.isoCode);
              setDialCode(`+${selected.phonecode}`);
              const nextStates = State.getStatesOfCountry(selected.isoCode);
              const nextStateCode = nextStates[0]?.isoCode || "";
              setStateCode(nextStateCode);
              const nextCities = (
                nextStateCode
                  ? City.getCitiesOfState(selected.isoCode, nextStateCode)
                  : City.getCitiesOfCountry(selected.isoCode)
              ) ?? [];
              setCityName(nextCities[0]?.name || "");
            }}
            required
          >
            {countries.map((country) => (
              <option key={country.isoCode} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">State *</label>
          <select
            className={fieldClass}
            name="state"
            value={states.find((item) => item.isoCode === stateCode)?.name || ""}
            onChange={(event) => {
              const selected = states.find((item) => item.name === event.target.value);
              if (selected) {
                setStateCode(selected.isoCode);
                const nextCities = City.getCitiesOfState(countryCode, selected.isoCode) ?? [];
                setCityName(nextCities[0]?.name || "");
              }
            }}
            required
          >
            {states.map((region) => (
              <option key={region.isoCode} value={region.name}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">City *</label>
          <select
            className={fieldClass}
            name="city"
            value={cityName}
            onChange={(event) => setCityName(event.target.value)}
            required
          >
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Address Line 1 *</label>
          <input className={fieldClass} name="address1" defaultValue={initialShipping.address1 || ""} required />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">Address Line 2</label>
          <input className={fieldClass} name="address2" defaultValue={initialShipping.address2 || ""} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Postal Code *</label>
          <input
            className={fieldClass}
            name="postalCode"
            defaultValue={initialShipping.postalCode || ""}
            autoComplete="postal-code"
            inputMode="numeric"
            pattern="^\d{4,10}$"
            minLength={4}
            maxLength={10}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[180px_1fr]">
        <div className="space-y-1">
          <label className="text-sm font-medium">Country Code *</label>
          <select
            className={fieldClass}
            name="countryCode"
            value={dialCode}
            onChange={(event) => setDialCode(event.target.value)}
            required
          >
            {dialCodeOptions.map((option) => (
              <option key={option.key} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Mobile Phone *</label>
          <input
            className={fieldClass}
            name="phone"
            defaultValue={initialShipping.phone || ""}
            autoComplete="tel-national"
            inputMode="numeric"
            pattern="^\d{7,15}$"
            minLength={7}
            maxLength={15}
            required
          />
        </div>
      </div>

      {formState && !formState.success ? (
        <p className="text-sm text-destructive">{formState.message}</p>
      ) : null}

      <button type="submit" disabled={isPending} className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-60">
        Continue
      </button>
          </>
        );
      })()}
    </form>
  );
};

export default ShippingAddressForm;
