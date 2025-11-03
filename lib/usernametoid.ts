export function usernametoid(username: string): string {
  const mapping: Record<string, string> = {
    sakuramiko: "UC-hM6YJuNYVAmUWxeIr9FeA",
    usadapekora: "UC1DCedRgGHBdm81E1llLhOQ",
    minatoaqua: "UC1opHUrw8rvnsadT-iGp7Cg",
    murasakishionch: "UCDqI2jOz0weumE8s7paEk6g",
    yuzukichoco: "UC1suqwovbL1kzsoaZgFZLKg",
  }

  return mapping[username] || ""
}
