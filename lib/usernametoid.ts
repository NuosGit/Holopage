export function usernametoid(username: string): string {
  const mapping: Record<string, string> = {
    sakuramiko: "UC-hM6YJuNYVAmUWxeIr9FeA",
    inugamikorone: "UChAnqc_AY5_I3Px5dig3X1Q",
    oozorasubaru: "UCvzGlP9oQwU--Y0r9id_jnA",
    usadapekora: "UC1DCedRgGHBdm81E1llLhOQ",
    hoshimachisuisei: "UC5CwaMl1eIgY8h02uZw7u8A",
  }

  return mapping[username] || ""
}
