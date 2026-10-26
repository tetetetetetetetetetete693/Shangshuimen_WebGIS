const base = import.meta.env.BASE_URL;
export function remoteAsset(name) {
  return `${base}remote-sensing/${encodeURIComponent(name)}`;
}
