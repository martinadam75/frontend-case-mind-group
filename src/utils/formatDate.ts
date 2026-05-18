export const formatarData = (dataString: string): string => {
  if (!dataString) return "";
  
  return new Date(dataString)
    .toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .replace(" de", "")
    .replace(".", "");
};